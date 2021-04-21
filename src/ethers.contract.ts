import { Injectable } from '@nestjs/common';
import { BaseProvider } from '@ethersproject/providers';
import { InjectEthersProvider } from './ethers.decorators';
import {
  Contract,
  ContractInterface as SmartContractInterface,
} from '@ethersproject/contracts';
import { Wallet as WalletSigner } from '@ethersproject/wallet';
import { VoidSigner } from '@ethersproject/abstract-signer';

export class SmartContract extends Contract {
  constructor(
    address: string,
    abi: SmartContractInterface,
    provider: BaseProvider,
    signer?: WalletSigner | VoidSigner,
  ) {
    const signerOrProvider: BaseProvider | WalletSigner | VoidSigner =
      signer ?? provider;

    super(address, abi, signerOrProvider);
  }
}

@Injectable()
export class EthersContract {
  constructor(
    @InjectEthersProvider() private readonly provider: BaseProvider,
  ) {}

  create(
    address: string,
    abi: SmartContractInterface,
    signer?: WalletSigner | VoidSigner,
  ): SmartContract {
    return new SmartContract(address, abi, this.provider, signer);
  }
}
