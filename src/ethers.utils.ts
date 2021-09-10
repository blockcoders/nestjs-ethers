import { DECORATED_PREFIX } from './ethers.constants';

export function getEthersToken(context?: string): string {
  return `${DECORATED_PREFIX}:Provider:${context || 'default'}`;
}
