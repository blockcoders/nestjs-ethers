import { Network, Networkish } from '@ethersproject/networks'
import {
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
  DECORATED_PREFIX,
  DEFAULT_TOKEN,
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
