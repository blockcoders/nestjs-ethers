import { Network, Networkish } from '@ethersproject/networks'
import {
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
  DECORATED_PREFIX,
  DEFAULT_TOKEN,
  GOERLI_NETWORK,
  SEPOLIA_NETWORK,
  MAINNET_NETWORK,
  POLYGON_NETWORK,
  MORDEN_NETWORK,
  MUMBAI_NETWORK,
  NETWORKS_BY_CHAIN_ID,
  NETWORKS_BY_NAME,
  UNSPECIFIED_NETWORK,
} from './ethers.constants'

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
    case MORDEN_NETWORK.chainId:
    case GOERLI_NETWORK.chainId:
    case SEPOLIA_NETWORK.chainId:
      return true
    default:
      return false
  }
}

export function isPolygonNetwork(network: Network): boolean {
  switch (network.chainId) {
    case POLYGON_NETWORK.chainId:
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
