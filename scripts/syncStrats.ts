/******
Script synchronizes which vaults should be operated on for harvesting based upon the 
list of voults currently in play at Beefy. In doing so, the script differentiates between 
which of the vaults should be harvested by Beefy's homegrown bot ("Cowllector") and 
on-chain servicers Beefy also employs to do this task (e.g. Gelato). The script also does 
any preparatory work required prior to any on-chain operations, like updating expected 
gas-limits to harvest vaults managed by Cowllector.

At the end of a run, a JSON log of the significant changes made by the sync is written to 
`data\stratsSync.json`.

Node run command: node --loader ts-node/esm scripts/syncStrats.ts
********/

import FETCH, {type Response} from 'node-fetch'; //pull in of type Response needed due to 
                                                 //  clash with WebWorker's version
import {ethers as ETHERS} from 'ethers';
import FS from 'fs';
import PATH from 'path';
import type {IVault, IStratToHrvst, IChain, IChains} from '../interfaces';
import {estimateGas} from '../utils/harvestHelpers';

const NOT_FOUND = -1;

const SettledPromiseRejected = (result: PromiseSettledResult< unknown>) : 
                          result is PromiseRejectedResult => 'rejected' === result.status;
const SettledPromiseFilled = <type> (result: PromiseSettledResult< type>) : 
                  result is PromiseFulfilledResult< type> => 'fulfilled' === result.status;

type HitType = 'added' | 'removed, inactive' | 'removed, decomissioned' | 
                'on-chain-harvest switch' | 'strategy update';
interface  Hit  {
  readonly id: string;
  type: HitType | HitType[];
}
class Hits  {
  readonly hits: Record< string, Hit> = {};
  add( id: string, 
        type: Readonly< HitType>) : void {
    if (!id)
      return;
    const hit = this.hits[ id];
    if (!hit)
      this.hits[ id] = {id: id, type: type};
    else if (!Array.isArray( hit.type))
      hit.type = [hit.type, type];
    else
      hit.type.push( type);
  } //add(
} //class Hits


class ChainStratManager  {
  private added: number = 0;
  private removed: number = 0;

  readonly denyOnChainHarvest: ReadonlySet< string> | null = null; 
  readonly notOnChainHarvest: IStratToHrvst[] = [];


  constructor( private readonly chain: IChain, 
                private readonly vaults: readonly IVault[], 
                private readonly encountered: Set< string>, 
                private readonly hits: Hits) {
    if (this.chain.hasOnChainHarvesting)
      this.denyOnChainHarvest = <ReadonlySet< string>> require( `../gelato/${this.chain.id
                                                        }VaultDenyList.ts`).vaultDenyList;
  } //constructor(


  SyncVaults( stratsToHarvest: IStratToHrvst[]) : boolean  {
    let dirty = false;
    this.vaults.forEach( (vault: IVault) => {
      if (this.chain.id !== vault.chain)
        return; 

      const index = stratsToHarvest.findIndex( (strat: IStratToHrvst) => 
                              vault.strategy === strat?.strategy && vault.id === strat.id); 
      let strat = NOT_FOUND != index ? stratsToHarvest[ index] : null;
      if (!strat)  {
        if (['eol', 'paused'].includes( vault.status))
           return;

        stratsToHarvest.push( strat = { id: vault.id,
                                          chain: vault.chain, 
                                          earnContractAddress: vault.earnContractAddress,
                                          earnedToken: vault.earnedToken,
                                          strategy: vault.strategy,
                                          lastHarvest: vault.lastHarvest});
        this.added++;
        dirty = true;
        this.encountered.add( vault.id);
        this.hits.add( vault.id, 'added');
      }else if (['eol', 'paused'].includes( vault.status))  {
        delete stratsToHarvest[ index];
        this.removed++;
        dirty = true;
        this.hits.add( vault.id, 'removed, inactive');
        return;
      }else
        this.encountered.add( vault.id);

      const onChainHarvest = this.chain.hasOnChainHarvesting && !this.denyOnChainHarvest?.has( 
                                                                        vault.earnedToken);

      if (onChainHarvest ? strat?.noOnChainHrvst : this.chain.hasOnChainHarvesting && 
                                                                !strat?.noOnChainHrvst)  {
        if (NOT_FOUND != index)  {
          strat.noOnChainHrvst = !onChainHarvest;
          dirty = true;
          this.hits.add( vault.id, 'on-chain-harvest switch');
        }else
          strat.noOnChainHrvst = !onChainHarvest;
      } //if (onChainHarvest ? strat?.noOnChainHrvst :
 
      if (!onChainHarvest)
        this.notOnChainHarvest.push( strat);

      if (NOT_FOUND == index)
        return;
   
      if (strat.strategy !== vault.strategy) { 
        strat.strategy = vault.strategy;
        dirty = true;
        this.hits.add( vault.id, 'strategy update');
        console.log( `    Strategy upgrade applied to vault: ${strat.id}`);
      }

      if (strat.lastHarvest < vault.lastHarvest) {
        strat.lastHarvest = vault.lastHarvest;
        dirty = true;
      }
    }); //vaults.forEach( (vault: IVault) =

    return dirty;
  } //SyncVaults(


  stratsChanged() : Readonly< {added: number, removed: number}> {
    return {added: this.added, removed: this.removed};
  }


  async AddGasLimits( strats: IStratToHrvst[]) : Promise< boolean>  {
    const provider = new ETHERS.providers.JsonRpcProvider( this.chain.rpc), 
          results = <readonly PromiseSettledResult< unknown>[]> await Promise.allSettled( 
                                    strats.map( (strat: IStratToHrvst) => 
                                    estimateGas( strat, this.chain.chainId, provider)));

    return !!results.find( SettledPromiseFilled);
  } //async AddGasLimits( strats:
} //class ChainStratManager


async function main() : Promise< void> {
  let vaults: ReadonlyArray< IVault> = [], 
      stratsToHarvest: IStratToHrvst[] = [];

  const urlVaults = `https://api.beefy.finance/vaults`;
  try {
    const response = await <Promise< Response>> FETCH( urlVaults);
    if (!( response.ok && response.body)) {
      console.log( 'Fetching vaults failed');
      return;
    }
    vaults = await <Promise< ReadonlyArray< IVault>>> response.json();
  } catch (error: unknown)  {
    console.log( error);
    return;
  }

  //(TODO, convert to a map-like object for efficient downstream lookups and removal 
  // handling)
  try {
    stratsToHarvest = <IStratToHrvst[]> require( '../data/stratsToHrvst.json');
  } catch (error: unknown)  {
    if (!( (( testError: unknown): testError is NodeJS.ErrnoException => 
                                  !!(< NodeJS.ErrnoException> testError).code)( error) && 
                                  'MODULE_NOT_FOUND' === error.code)) {
      console.log( error);
      return;
    }
  } //try

  const hits = new Hits(), 
        encountered: Set< string> = new Set();
  let dirty = false;

/*Object.values( <Readonly< IChains>> require( '../data/chains.js')).forEach( (chain: IChain) =>  {*/  await Promise.all( Object.values( <Readonly< IChains>> require( 
                                      '../data/chains.js')).map( async (chain: IChain) => {
    const stratManager = new ChainStratManager( chain, vaults, encountered, hits);
    if (stratManager.SyncVaults( stratsToHarvest))
      dirty = true;
    const {added, removed} = stratManager.stratsChanged();
    if (added || removed)
      console.log( `Strats on ${chain.id.toUpperCase()}: ${added } added, ${removed
                                                                              } removed`);
    else
      console.log( `No strats added or removed from ${chain.id.toUpperCase()}`);

/*if(false)*/   if (stratManager.notOnChainHarvest.length)  {
      console.log( `  Updating gas-limit values on Cowllector-managed ${
                                                      chain.id.toUpperCase()} strats...`);
/**/  if (await stratManager.AddGasLimits( stratManager.notOnChainHarvest))
/**/    dirty = true;
      console.log( `    Finished gas-limit updates on ${chain.id.toUpperCase()}`);
    }
  })); //await Promise.all( Object.values( <Readonly< IChains>>
//debugger;
  stratsToHarvest.forEach( (strat, index) => {
    if (encountered.has( strat.id))
      return;

    delete stratsToHarvest[ index];
    hits.add( strat.id, 'removed, decomissioned');
  }); //stratsToHarvest.forEach( strat

  const index = Object.keys( hits.hits).length;
  if (index)  {
    FS.writeFileSync(PATH.join( __dirname, '../data/stratsSync.json'),
                                  JSON.stringify( Object.values( hits.hits), null, 2));
    console.log( `\nLog of ${index} significant changes written to data/stratsSync.json`);
  }
  
  if (dirty)
    FS.writeFileSync( PATH.join( __dirname, '../data/stratsToHrvst.json'),
                      JSON.stringify( stratsToHarvest.filter( strat => strat), null, 2));
} //function async main(


main();
