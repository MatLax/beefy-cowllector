require('dotenv').config();
const { addressBook } = require('blockchain-addressbook');

const { aurora, arbitrum, bsc, heco, avax, polygon, fantom, one, celo, moonriver, cronos, fuse } =
  addressBook;

const chains = {
  56: {
    id: 'bsc',
    chainId: 56,
    wnative: bsc.tokens.WNATIVE.address,
    rewardPool: bsc.platforms.beefyfinance.rewardPool,
    notifyInterval: 10,
    treasury: bsc.platforms.beefyfinance.treasury,
    beefyFeeBatcher: bsc.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 4,
    wnativeUnwrapInterval: 8,
    rpc: process.env.BSC_RPC || 'https://bsc-dataseed2.defibit.io/',
    appVaultsFilename: 'bsc_pools.js',
    multicall: bsc.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    firstRewardBlock: 1457038,
    blockTime: 3,
    blockExplorer: 'http://bscscan.com',
    gas: {
      limit: 2e7,
      price: 5e9,
    },
  },
  128: {
    id: 'heco',
    chainId: 128,
    wnative: heco.tokens.WNATIVE.address,
    rewardPool: heco.platforms.beefyfinance.rewardPool,
    treasury: heco.platforms.beefyfinance.treasury,
    beefyFeeBatcher: heco.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 4,
    wnativeUnwrapInterval: 4,
    rpc: process.env.HECO_RPC || 'https://http-mainnet.hecochain.com',
    appVaultsFilename: 'heco_pools.js',
    multicall: heco.platforms.beefyfinance.multicall,
    queryLimit: 2000,
    queryInterval: 100,
    blockTime: 3,
    blockExplorer: 'https://hecoinfo.com',
    gas: {
      limit: 30e6,
      price: 3e9,
    },
  },
  43114: {
    id: 'avax',
    chainId: 43114,
    wnative: avax.tokens.WNATIVE.address,
    rewardPool: avax.platforms.beefyfinance.rewardPool,
    treasury: avax.platforms.beefyfinance.treasury,
    beefyFeeBatcher: avax.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 8,
    wnativeUnwrapInterval: 8,
    rpc: process.env.AVAX_RPC || 'https://api.avax.network/ext/bc/C/rpc',
    appVaultsFilename: 'avalanche_pools.js',
    multicall: avax.platforms.beefyfinance.multicall,
    queryLimit: 512,
    queryInterval: 100,
    blockTime: 5,
    blockExplorer: 'https://cchain.explorer.avax.network',
    gas: {
      limit: 1e6,
      price: 30e9,
    },
  },
  137: {
    id: 'polygon',
    chainId: 137,
    wnative: polygon.tokens.WNATIVE.address,
    rewardPool: polygon.platforms.beefyfinance.rewardPool,
    treasury: polygon.platforms.beefyfinance.treasury,
    beefyFeeBatcher: polygon.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 1,
    wnativeUnwrapInterval: 4,
    rpc: process.env.POLYGON_RPC || 'https://polygon-rpc.com/',
    appVaultsFilename: 'polygon_pools.js',
    multicall: polygon.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 2,
    blockExplorer: 'https://polygonscan.com',
    gas: {
      limit: 2e6,
      price: 30e9,
    },
  },
  250: {
    id: 'fantom',
    chainId: 250,
    wnative: fantom.tokens.WNATIVE.address,
    rewardPool: fantom.platforms.beefyfinance.rewardPool,
    treasury: fantom.platforms.beefyfinance.treasury,
    beefyFeeBatcher: fantom.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 1,
    wnativeUnwrapInterval: 4,
    rpc: process.env.FANTOM_RPC || 'https://rpcapi.fantom.network',
    appVaultsFilename: 'fantom_pools.js',
    multicall: fantom.platforms.beefyfinance.multicall,
    queryLimit: 500,
    queryInterval: 100,
    blockTime: 10,
    blockExplorer: 'https://ftmscan.com',
    gas: {
      limit: 3e6,
      price: null,
    },
  },
  1666600000: {
    id: 'one',
    chainId: 1666600000,
    wnative: one.tokens.WNATIVE.address,
    rewardPool: one.platforms.beefyfinance.rewardPool,
    treasury: one.platforms.beefyfinance.treasury,
    beefyFeeBatcher: one.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 1,
    wnativeUnwrapInterval: 4,
    rpc: process.env.ONE_RPC || 'https://api.s0.t.hmny.io/',
    appVaultsFilename: 'harmony_pools.js',
    multicall: one.platforms.beefyfinance.multicall,
    queryLimit: 500,
    queryInterval: 100,
    blockTime: 3,
    blockExplorer: 'https://explorer.harmony.one/',
    gas: {
      limit: 1e6,
      price: null,
    },
  },
  42161: {
    id: 'arbitrum',
    chainId: 42161,
    wnative: arbitrum.tokens.WNATIVE.address,
    rewardPool: arbitrum.platforms.beefyfinance.rewardPool,
    treasury: arbitrum.platforms.beefyfinance.treasury,
    beefyFeeBatcher: arbitrum.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 8,
    wnativeUnwrapInterval: 20,
    rpc: process.env.ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc',
    appVaultsFilename: 'arbitrum_pools.js',
    multicall: arbitrum.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 2.8,
    blockExplorer: 'http://arbiscan.com',
    gas: {
      limit: 30e6,
      price: 5e9,
    },
  },
  42220: {
    id: 'celo',
    chainId: 42220,
    rewardPool: celo.platforms.beefyfinance.rewardPool,
    treasury: celo.platforms.beefyfinance.treasury,
    beefyFeeBatcher: celo.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 1,
    wnativeUnwrapInterval: null,
    rpc: process.env.CELO_RPC || 'https://forno.celo.org',
    appVaultsFilename: 'celo_pools.js',
    multicall: celo.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 5,
    blockExplorer: 'https://explorer.celo.org/',
    gas: {
      limit: 5e6,
      price: 5e8,
    },
  },
  1285: {
    id: 'moonriver',
    chainId: 1285,
    wnative: moonriver.tokens.WNATIVE.address,
    rewardPool: moonriver.platforms.beefyfinance.rewardPool,
    treasury: moonriver.platforms.beefyfinance.treasury,
    beefyFeeBatcher: moonriver.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 2,
    wnativeUnwrapInterval: 6,
    rpc: process.env.MOONRIVER_RPC || 'https://rpc.moonriver.moonbeam.network',
    appVaultsFilename: 'moonriver_pools.js',
    multicall: moonriver.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 15,
    blockExplorer: 'https://moonriver.moonscan.io/',
    gas: {
      limit: 5e6,
      price: 1e9,
    },
  },
  25: {
    id: 'cronos',
    chainId: 25,
    wnative: cronos.tokens.WNATIVE.address,
    rewardPool: cronos.platforms.beefyfinance.rewardPool,
    treasury: cronos.platforms.beefyfinance.treasury,
    beefyFeeBatcher: cronos.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 6,
    wnativeUnwrapInterval: 6,
    rpc: process.env.CRONOS_RPC || 'https://evm-cronos.crypto.org',
    appVaultsFilename: 'cronos_pools.js',
    multicall: cronos.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 5,
    blockExplorer: 'https://cronos.crypto.org/explorer/',
    gas: {
      limit: 1e6,
      price: 5e12,
    },
  },
  122: {
    id: 'fuse',
    chainId: 122,
    wnative: fuse.tokens.WNATIVE.address,
    rewardPool: fuse.platforms.beefyfinance.rewardPool,
    treasury: fuse.platforms.beefyfinance.treasury,
    beefyFeeBatcher: fuse.platforms.beefyfinance.beefyFeeRecipient,
    beefyFeeHarvestInterval: 1,
    wnativeUnwrapInterval: 6,
    rpc: process.env.FUSE_RPC || 'https://rpc.fuse.io',
    appVaultsFilename: 'fuse_pools.js',
    multicall: fuse.platforms.beefyfinance.multicall,
    queryLimit: 1000,
    queryInterval: 100,
    blockTime: 5,
    blockExplorer: 'https://explorer.fuse.io/',
    gas: {
      limit: 30e6,
      price: 1e9,
    },
  },
  // 1313161554: {
  //   id: 'aurora',
  //   chainId: 1313161554,
  //   wnative: aurora.tokens.WNATIVE.address,
  //   rewardPool: aurora.platforms.beefyfinance.rewardPool,
  //   treasury: aurora.platforms.beefyfinance.treasury,
  //   beefyFeeBatcher: aurora.platforms.beefyfinance.beefyFeeRecipient,
  //   beefyFeeHarvestInterval: 2,
  //   wnativeUnwrapInterval: 8,
  //   rpc:
  //     process.env.aurora_RPC ||
  //     'https://mainnet.aurora.dev/Fon6fPMs5rCdJc4mxX4kiSK1vsKdzc3D8k6UF8aruek',
  //   appVaultsFilename: 'aurora_pools.js',
  //   multicall: aurora.platforms.beefyfinance.multicall,
  //   queryLimit: 1000,
  //   queryInterval: 100,
  //   blockTime: 1,
  //   blockExplorer: 'https://explorer.mainnet.aurora.dev/',
  // gas: {
  //   limit: 30e6,
  //   price: 1e9,
  // },
  // },
};

module.exports = chains;
