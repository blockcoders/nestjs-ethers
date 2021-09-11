import { VoidSigner } from '@ethersproject/abstract-signer'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { BaseProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Injectable } from '@nestjs/common'
import { InjectEthersProvider } from './ethers.decorators'

export class SmartContract extends Contract {
  constructor(
    address: string,
    abi: ContractInterface,
    provider: BaseProvider,
    signer?: Wallet | VoidSigner,
  ) {
    const signerOrProvider: BaseProvider | Wallet | VoidSigner = signer ?? provider

    super(address, abi, signerOrProvider)
  }
}

@Injectable()
export class EthersContract {
  constructor(@InjectEthersProvider() private readonly provider: BaseProvider) {}

  create(address: string, abi: ContractInterface, signer?: Wallet | VoidSigner): SmartContract {
    return new SmartContract(address, abi, this.provider, signer)
  }
}
