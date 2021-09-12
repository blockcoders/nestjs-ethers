import { Network } from '@ethersproject/providers'

export const DECORATED_PREFIX = 'EthersJS'
export const ETHERS_PROVIDER_NAME = 'EthersProviderName'
export const ETHERS_MODULE_OPTIONS = 'EthersModuleOptions'
export const HOMESTEAD_NETWORK: Network = {
  chainId: 1,
  name: 'homestead',
}
export const MAINNET_NETWORK: Network = HOMESTEAD_NETWORK
export const ROPSTEN_NETWORK: Network = {
  chainId: 3,
  name: 'ropsten',
}
export const TESTNET_NETWORK: Network = ROPSTEN_NETWORK
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
export const CLASSIC_TESTNET_NETWORK: Network = CLASSIC_MORDEN_NETWORK
export const CLASSIC_KOTTI_NETWORK: Network = {
  chainId: 6,
  name: 'classicKotti',
}
export const XDAI_NETWORK: Network = {
  chainId: 100,
  name: 'xdai',
}
export const MATIC_NETWORK: Network = {
  chainId: 137,
  name: 'matic',
}
export const MUMBAI_NETWORK: Network = {
  chainId: 80001,
  name: 'maticmum',
}
export const BNB_NETWORK: Network = {
  chainId: 56,
  name: 'bnb',
}
export const BNB_TESTNET_NETWORK: Network = {
  chainId: 97,
  name: 'bnbt',
}
/**
 * @see {@link https://github.com/ethers-io/ancillary-bsc/blob/main/dist/bsc.esm.js#L8}
 */
export const BINANCE_NETWORK: Network = {
  chainId: 0x38,
  name: 'bsc-mainnet',
}
/**
 * @see {@link https://github.com/ethers-io/ancillary-bsc/blob/main/dist/bsc.esm.js#L12}
 */
export const BINANCE_TESTNET_NETWORK: Network = {
  chainId: 0x61,
  name: 'bsc-testnet',
}
