import { Inject } from '@nestjs/common';
import { getEthersToken } from './ethers.utils';

export const InjectProvider = (context = '') => Inject(getEthersToken(context));
