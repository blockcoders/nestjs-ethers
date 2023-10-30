import { VoidSigner, Wallet, Contract, InterfaceAbi, AbstractProvider } from 'ethers'

export class EthersContract {
  private readonly provider: AbstractProvider

  constructor(provider: AbstractProvider) {
    this.provider = provider
  }

  create(address: string, abi: InterfaceAbi, signer?: Wallet | VoidSigner): Contract {
    return new Contract(address, abi, signer ?? this.provider)
  }
}
