import { Network, Networkish } from '@ethersproject/networks'
import {
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
  CLASSIC_KOTTI_NETWORK,
  CLASSIC_MORDEN_NETWORK,
  CLASSIC_MORDOR_NETWORK,
  CLASSIC_NETWORK,
  DECORATED_PREFIX,
  DEFAULT_TOKEN,
  GOERLI_NETWORK,
  KOVAN_NETWORK,
  MAINNET_NETWORK,
  MATIC_NETWORK,
  MORDEN_NETWORK,
  MUMBAI_NETWORK,
  NETWORKS_BY_CHAIN_ID,
  NETWORKS_BY_NAME,
  RINKEBY_NETWORK,
  ROPSTEN_NETWORK,
  UNSPECIFIED_NETWORK,
} from './ethers.constants'
import { EthersModuleOptions, EthereumModuleOptions, BinanceModuleOptions } from './ethers.interface'

export function getEthersToken(token?: string): string {
  return `${DECORATED_PREFIX}:Provider:${token || DEFAULT_TOKEN}`
}

export function getContractToken(token?: string): string {
  return `${DECORATED_PREFIX}:Contract:${token || DEFAULT_TOKEN}`
}

export function getSignerToken(token?: string): string {
  return `${DECORATED_PREFIX}:Signer:${token || DEFAULT_TOKEN}`
}

export function getNetwork(network: Networkish | null | undefined): Network {
  if (!network) {
    throw new Error(`Invalid value: ${network}`)
  }

  if (typeof network === 'number' && NETWORKS_BY_CHAIN_ID[network]) {
    return NETWORKS_BY_CHAIN_ID[network]
  }

  if (typeof network === 'string' && NETWORKS_BY_NAME[network]) {
    return NETWORKS_BY_NAME[network]
  }

  if (typeof network !== 'number' && typeof network !== 'string' && network.chainId) {
    return network
  }

  return UNSPECIFIED_NETWORK
}

export function isBinanceNetwork(network: Network): boolean {
  switch (network.chainId) {
    case BINANCE_NETWORK.chainId:
    case BINANCE_TESTNET_NETWORK.chainId:
      return true
    default:
      return false
  }
}

export function isEthereumNetwork(network: Network): boolean {
  switch (network.chainId) {
    case MAINNET_NETWORK.chainId:
    case ROPSTEN_NETWORK.chainId:
    case CLASSIC_MORDOR_NETWORK.chainId:
    case MORDEN_NETWORK.chainId:
    case RINKEBY_NETWORK.chainId:
    case KOVAN_NETWORK.chainId:
    case GOERLI_NETWORK.chainId:
    case CLASSIC_NETWORK.chainId:
    case CLASSIC_MORDEN_NETWORK.chainId:
    case CLASSIC_KOTTI_NETWORK.chainId:
      return true
    default:
      return false
  }
}

export function isPolygonNetwork(network: Network): boolean {
  switch (network.chainId) {
    case MATIC_NETWORK.chainId:
    case MUMBAI_NETWORK.chainId:
      return true
    default:
      return false
  }
}

export function getBinanceNetwork(_network: Networkish): Network {
  const network = getNetwork(_network)

  if (!isBinanceNetwork(network)) {
    throw new Error(`Unsupported network binance network: ${network.name}`)
  }

  return network
}

export function getEthereumNetwork(_network: Networkish): Network {
  const network = getNetwork(_network)

  if (!isEthereumNetwork(network)) {
    throw new Error(`Unsupported network ethereum network: ${network.name}`)
  }

  return network
}

export function isEthereumOptions(options: EthersModuleOptions): options is EthereumModuleOptions {
  return isEthereumNetwork(getNetwork((options as EthereumModuleOptions).network))
}

export function isBinanceOptions(options: EthersModuleOptions): options is BinanceModuleOptions {
  return isBinanceNetwork(getNetwork((options as BinanceModuleOptions).network))
}

export function isPolygonOptions(options: EthersModuleOptions): options is BinanceModuleOptions {
  return isPolygonNetwork(getNetwork((options as BinanceModuleOptions).network))
}
