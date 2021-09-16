import { Inject } from '@nestjs/common'
import { getContractToken, getEthersToken, getSigneroken } from './ethers.utils'

export const InjectEthersProvider = (token?: string) => {
  return Inject(getEthersToken(token))
}

export const InjectContractProvider = (token?: string) => {
  return Inject(getContractToken(token))
}

export const InjectSignerProvider = (token?: string) => {
  return Inject(getSigneroken(token))
}
