import { DECORATED_PREFIX } from './ethers.constants';

export function getEthersToken(context: string): string {
  return context ? `${DECORATED_PREFIX}:${context}` : DECORATED_PREFIX;
}
