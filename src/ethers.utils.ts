import { Network, Networkish } from 'ethers'
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

export function getNetwork(network?: Networkish): Network {
  if (!network) {
    throw new Error(`Invalid value: ${network}`)
  }

  if (typeof network === 'number' && NETWORKS_BY_CHAIN_ID.has(BigInt(network))) {
    return NETWORKS_BY_CHAIN_ID.get(BigInt(network)) as Network
  }

  if (typeof network === 'string' && NETWORKS_BY_NAME.has(network)) {
    return NETWORKS_BY_NAME.get(network) as Network
  }

  if (typeof network !== 'bigint' && typeof network !== 'number' && typeof network !== 'string' && network?.name) {
    return Network.from(network)
  }

  return UNSPECIFIED_NETWORK
}

export function isBinanceNetwork(network: Network): boolean {
  switch (network.name) {
    case BINANCE_NETWORK.name:
    case BINANCE_TESTNET_NETWORK.name:
      return true
    default:
      return false
  }
}
