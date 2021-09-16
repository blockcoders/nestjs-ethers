import { DECORATED_PREFIX, DEFAULT_TOKEN } from './ethers.constants'

export function getEthersToken(token?: string): string {
  return `${DECORATED_PREFIX}:Provider:${token || DEFAULT_TOKEN}`
}

export function getContractToken(token?: string): string {
  return `${DECORATED_PREFIX}:Contract:${token || DEFAULT_TOKEN}`
}

export function getSigneroken(token?: string): string {
  return `${DECORATED_PREFIX}:Signer:${token || DEFAULT_TOKEN}`
}
