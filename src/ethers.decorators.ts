import { Inject } from '@nestjs/common';
import { getEthersToken } from './ethers.utils';

export const InjectEthersProvider = (context?: string) =>
  Inject(getEthersToken(context));
