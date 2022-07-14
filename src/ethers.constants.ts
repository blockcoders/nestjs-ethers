import { Network } from '@ethersproject/providers'

export const DECORATED_PREFIX = 'EthersJS'
export const ETHERS_MODULE_OPTIONS = 'EthersModuleOptions'
export const DEFAULT_TOKEN = 'default'
export const BSCSCAN_DEFAULT_API_KEY = 'EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9'
export const BINANCE_POCKET_DEFAULT_APP_ID = '6136201a7bad1500343e248d'
export const MAINNET_NETWORK: Network = {
  chainId: 1,
  name: 'homestead',
}
export const ROPSTEN_NETWORK: Network = {
  chainId: 3,
  name: 'ropsten',
}
export const CLASSIC_MORDOR_NETWORK: Network = {
  chainId: 63,
  name: 'classicMordor',
}
export const UNSPECIFIED_NETWORK: Network = {
  chainId: 0,
  name: 'unspecified',
}
export const MORDEN_NETWORK: Network = {
  chainId: 2,
  name: 'morden',
}
export const RINKEBY_NETWORK: Network = {
  chainId: 4,
  name: 'rinkeby',
}
export const KOVAN_NETWORK: Network = {
  chainId: 42,
  name: 'kovan',
}
export const GOERLI_NETWORK: Network = {
  chainId: 5,
  name: 'goerli',
}
export const CLASSIC_NETWORK: Network = {
  chainId: 61,
  name: 'classic',
}
export const CLASSIC_MORDEN_NETWORK: Network = {
  chainId: 62,
  name: 'classicMorden',
}
export const CLASSIC_KOTTI_NETWORK: Network = {
  chainId: 6,
  name: 'classicKotti',
}
export const GNOSIS_NETWORK: Network = {
  chainId: 100,
  name: 'gnosis',
}
export const MATIC_NETWORK: Network = {
  chainId: 137,
  name: 'matic',
}
export const MUMBAI_NETWORK: Network = {
  chainId: 80001,
  name: 'maticmum',
}
export const BINANCE_NETWORK: Network = {
  chainId: 56,
  name: 'binance',
}
export const BINANCE_TESTNET_NETWORK: Network = {
  chainId: 97,
  name: 'binance-testnet',
}
export const OPTIMISM_NETWORK: Network = {
  chainId: 10,
  name: 'optimism',
}
export const OPTIMISM_KOVAN_NETWORK: Network = {
  chainId: 69,
  name: 'optimism-kovan',
}
export const OPTIMISM_GOERLI_NETWORK: Network = {
  chainId: 420,
  name: 'optimism-goerli',
}
export const ARBITRUM_NETWORK: Network = {
  chainId: 42161,
  name: 'arbitrum',
}
export const ARBITRUM_RINKEBY_NETWORK: Network = {
  chainId: 421611,
  name: 'arbitrum',
}
export const AVALANCHE_NETWORK: Network = {
  chainId: 43114,
  name: 'avalanche',
}
export const AVALANCHE_FUJI_NETWORK: Network = {
  chainId: 43113,
  name: 'avalanche-fuji',
}
export const CRONOS_NETWORK: Network = {
  chainId: 25,
  name: 'cronos',
}
export const CRONOS_TESTNET_NETWORK: Network = {
  chainId: 338,
  name: 'cronos-testnet',
}
export const FANTOM_NETWORK: Network = {
  chainId: 250,
  name: 'fantom',
}
export const FANTOM_TESTNET_NETWORK: Network = {
  chainId: 4002,
  name: 'fantom-testnet',
}
export const AURORA_NETWORK: Network = {
  chainId: 1313161554,
  name: 'aurora',
}
export const AURORA_BETA_NETWORK: Network = {
  chainId: 1313161556,
  name: 'aurora-beta',
}
export const AURORA_TESTNET_NETWORK: Network = {
  chainId: 1313161555,
  name: 'aurora-testnet',
}
export const HARMONY_SHARD_0_NETWORK: Network = {
  chainId: 1666600000,
  name: 'harmony-shard-0',
}
export const HARMONY_SHARD_1_NETWORK: Network = {
  chainId: 1666600001,
  name: 'harmony-shard-1',
}
export const HARMONY_SHARD_2_NETWORK: Network = {
  chainId: 1666600002,
  name: 'harmony-shard-2',
}
export const HARMONY_SHARD_3_NETWORK: Network = {
  chainId: 1666600003,
  name: 'harmony-shard-3',
}
export const HARMONY_TESTNET_SHARD_0_NETWORK: Network = {
  chainId: 1666700000,
  name: 'harmony-testnet-shard-0',
}
export const HARMONY_TESTNET_SHARD_1_NETWORK: Network = {
  chainId: 1666700001,
  name: 'harmony-testnet-shard-1',
}
export const HARMONY_TESTNET_SHARD_2_NETWORK: Network = {
  chainId: 1666700002,
  name: 'harmony-testnet-shard-2',
}
export const HARMONY_TESTNET_SHARD_3_NETWORK: Network = {
  chainId: 1666700003,
  name: 'harmony-testnet-shard-3',
}

export const NETWORKS_BY_CHAIN_ID: Record<number, Network> = {
  [MAINNET_NETWORK.chainId]: MAINNET_NETWORK,
  [ROPSTEN_NETWORK.chainId]: ROPSTEN_NETWORK,
  [CLASSIC_MORDOR_NETWORK.chainId]: CLASSIC_MORDOR_NETWORK,
  [UNSPECIFIED_NETWORK.chainId]: UNSPECIFIED_NETWORK,
  [MORDEN_NETWORK.chainId]: MORDEN_NETWORK,
  [RINKEBY_NETWORK.chainId]: RINKEBY_NETWORK,
  [KOVAN_NETWORK.chainId]: KOVAN_NETWORK,
  [GOERLI_NETWORK.chainId]: GOERLI_NETWORK,
  [CLASSIC_NETWORK.chainId]: CLASSIC_NETWORK,
  [CLASSIC_MORDEN_NETWORK.chainId]: CLASSIC_MORDEN_NETWORK,
  [CLASSIC_KOTTI_NETWORK.chainId]: CLASSIC_KOTTI_NETWORK,
  [GNOSIS_NETWORK.chainId]: GNOSIS_NETWORK,
  [MATIC_NETWORK.chainId]: MATIC_NETWORK,
  [MUMBAI_NETWORK.chainId]: MUMBAI_NETWORK,
  [BINANCE_NETWORK.chainId]: BINANCE_NETWORK,
  [BINANCE_TESTNET_NETWORK.chainId]: BINANCE_TESTNET_NETWORK,
  [OPTIMISM_NETWORK.chainId]: OPTIMISM_NETWORK,
  [OPTIMISM_KOVAN_NETWORK.chainId]: OPTIMISM_KOVAN_NETWORK,
  [OPTIMISM_GOERLI_NETWORK.chainId]: OPTIMISM_GOERLI_NETWORK,
  [ARBITRUM_NETWORK.chainId]: ARBITRUM_NETWORK,
  [ARBITRUM_RINKEBY_NETWORK.chainId]: ARBITRUM_RINKEBY_NETWORK,
  [AVALANCHE_NETWORK.chainId]: AVALANCHE_NETWORK,
  [AVALANCHE_FUJI_NETWORK.chainId]: AVALANCHE_FUJI_NETWORK,
  [CRONOS_NETWORK.chainId]: CRONOS_NETWORK,
  [CRONOS_TESTNET_NETWORK.chainId]: CRONOS_TESTNET_NETWORK,
  [FANTOM_NETWORK.chainId]: FANTOM_NETWORK,
  [FANTOM_TESTNET_NETWORK.chainId]: FANTOM_TESTNET_NETWORK,
  [AURORA_NETWORK.chainId]: AURORA_NETWORK,
  [AURORA_BETA_NETWORK.chainId]: AURORA_BETA_NETWORK,
  [AURORA_TESTNET_NETWORK.chainId]: AURORA_TESTNET_NETWORK,
  [HARMONY_SHARD_0_NETWORK.chainId]: HARMONY_SHARD_0_NETWORK,
  [HARMONY_SHARD_1_NETWORK.chainId]: HARMONY_SHARD_1_NETWORK,
  [HARMONY_SHARD_2_NETWORK.chainId]: HARMONY_SHARD_2_NETWORK,
  [HARMONY_SHARD_3_NETWORK.chainId]: HARMONY_SHARD_3_NETWORK,
  [HARMONY_TESTNET_SHARD_0_NETWORK.chainId]: HARMONY_TESTNET_SHARD_0_NETWORK,
  [HARMONY_TESTNET_SHARD_1_NETWORK.chainId]: HARMONY_TESTNET_SHARD_1_NETWORK,
  [HARMONY_TESTNET_SHARD_2_NETWORK.chainId]: HARMONY_TESTNET_SHARD_2_NETWORK,
  [HARMONY_TESTNET_SHARD_3_NETWORK.chainId]: HARMONY_TESTNET_SHARD_3_NETWORK,
}

export const NETWORKS_BY_NAME: Record<string, Network> = {
  [MAINNET_NETWORK.name]: MAINNET_NETWORK,
  [ROPSTEN_NETWORK.name]: ROPSTEN_NETWORK,
  [CLASSIC_MORDOR_NETWORK.name]: CLASSIC_MORDOR_NETWORK,
  [UNSPECIFIED_NETWORK.name]: UNSPECIFIED_NETWORK,
  [MORDEN_NETWORK.name]: MORDEN_NETWORK,
  [RINKEBY_NETWORK.name]: RINKEBY_NETWORK,
  [KOVAN_NETWORK.name]: KOVAN_NETWORK,
  [GOERLI_NETWORK.name]: GOERLI_NETWORK,
  [CLASSIC_NETWORK.name]: CLASSIC_NETWORK,
  [CLASSIC_MORDEN_NETWORK.name]: CLASSIC_MORDEN_NETWORK,
  [CLASSIC_KOTTI_NETWORK.name]: CLASSIC_KOTTI_NETWORK,
  [GNOSIS_NETWORK.name]: GNOSIS_NETWORK,
  [MATIC_NETWORK.name]: MATIC_NETWORK,
  [MUMBAI_NETWORK.name]: MUMBAI_NETWORK,
  [BINANCE_NETWORK.name]: BINANCE_NETWORK,
  [BINANCE_TESTNET_NETWORK.name]: BINANCE_TESTNET_NETWORK,
  [OPTIMISM_NETWORK.name]: OPTIMISM_NETWORK,
  [OPTIMISM_KOVAN_NETWORK.name]: OPTIMISM_KOVAN_NETWORK,
  [OPTIMISM_GOERLI_NETWORK.name]: OPTIMISM_GOERLI_NETWORK,
  [ARBITRUM_NETWORK.name]: ARBITRUM_NETWORK,
  [ARBITRUM_RINKEBY_NETWORK.name]: ARBITRUM_RINKEBY_NETWORK,
  [AVALANCHE_NETWORK.name]: AVALANCHE_NETWORK,
  [AVALANCHE_FUJI_NETWORK.name]: AVALANCHE_FUJI_NETWORK,
  [CRONOS_NETWORK.name]: CRONOS_NETWORK,
  [CRONOS_TESTNET_NETWORK.name]: CRONOS_TESTNET_NETWORK,
  [FANTOM_NETWORK.name]: FANTOM_NETWORK,
  [FANTOM_TESTNET_NETWORK.name]: FANTOM_TESTNET_NETWORK,
  [AURORA_NETWORK.name]: AURORA_NETWORK,
  [AURORA_BETA_NETWORK.name]: AURORA_BETA_NETWORK,
  [AURORA_TESTNET_NETWORK.name]: AURORA_TESTNET_NETWORK,
  [HARMONY_SHARD_0_NETWORK.name]: HARMONY_SHARD_0_NETWORK,
  [HARMONY_SHARD_1_NETWORK.name]: HARMONY_SHARD_1_NETWORK,
  [HARMONY_SHARD_2_NETWORK.name]: HARMONY_SHARD_2_NETWORK,
  [HARMONY_SHARD_3_NETWORK.name]: HARMONY_SHARD_3_NETWORK,
  [HARMONY_TESTNET_SHARD_0_NETWORK.name]: HARMONY_TESTNET_SHARD_0_NETWORK,
  [HARMONY_TESTNET_SHARD_1_NETWORK.name]: HARMONY_TESTNET_SHARD_1_NETWORK,
  [HARMONY_TESTNET_SHARD_2_NETWORK.name]: HARMONY_TESTNET_SHARD_2_NETWORK,
  [HARMONY_TESTNET_SHARD_3_NETWORK.name]: HARMONY_TESTNET_SHARD_3_NETWORK,
}
