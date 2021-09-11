import { VoidSigner } from '@ethersproject/abstract-signer'
import { Contract, ContractInterface as SmartContractInterface } from '@ethersproject/contracts'
import { BaseProvider } from '@ethersproject/providers'
import { Wallet as WalletSigner } from '@ethersproject/wallet'
import { Injectable } from '@nestjs/common'
import { InjectEthersProvider } from './ethers.decorators'

export class SmartContract extends Contract {
  constructor(
    address: string,
    abi: SmartContractInterface,
    provider: BaseProvider,
    signer?: WalletSigner | VoidSigner,
  ) {
    const signerOrProvider: BaseProvider | WalletSigner | VoidSigner = signer ?? provider

    super(address, abi, signerOrProvider)
  }
}

@Injectable()
export class EthersContract {
  constructor(@InjectEthersProvider() private readonly provider: BaseProvider) {}

  create(address: string, abi: SmartContractInterface, signer?: WalletSigner | VoidSigner): SmartContract {
    return new SmartContract(address, abi, this.provider, signer)
  }
}
