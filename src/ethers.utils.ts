import { DECORATED_PREFIX } from './ethers.constants';

export function getEthersToken(): string {
  return `${DECORATED_PREFIX}:Provider`;
}
