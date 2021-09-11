import { Inject } from '@nestjs/common'
import { getEthersToken } from './ethers.utils'

export const InjectEthersProvider = () => Inject(getEthersToken())
