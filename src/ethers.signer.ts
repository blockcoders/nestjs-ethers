import { ExternallyOwnedAccount, VoidSigner } from '@ethersproject/abstract-signer'
import { BytesLike } from '@ethersproject/bytes'
import { ProgressCallback } from '@ethersproject/json-wallets'
import { BaseProvider } from '@ethersproject/providers'
import { SigningKey } from '@ethersproject/signing-key'
import { Wallet } from '@ethersproject/wallet'
import { Wordlist } from '@ethersproject/wordlists'
import { Injectable } from '@nestjs/common'
import { InjectEthersProvider } from './ethers.decorators'
import { RandomWalletOptions } from './ethers.interface'

@Injectable()
export class EthersSigner {
  constructor(@InjectEthersProvider() private readonly provider: BaseProvider) {}

  createWallet(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey): Wallet {
    return new Wallet(privateKey, this.provider)
  }

  createRandomWallet(options?: RandomWalletOptions): Wallet {
    const wallet = Wallet.createRandom(options) as Wallet

    return wallet.connect(this.provider)
  }

  async createWalletfromEncryptedJson(
    jsonString: string,
    password: BytesLike,
    progressCallback?: ProgressCallback,
  ): Promise<Wallet> {
    const wallet = await Wallet.fromEncryptedJson(jsonString, password, progressCallback)

    return wallet.connect(this.provider)
  }

  createWalletfromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet {
    const wallet = Wallet.fromMnemonic(mnemonic, path, wordlist) as Wallet

    return wallet.connect(this.provider)
  }

  createVoidSigner(address: string): VoidSigner {
    return new VoidSigner(address, this.provider)
  }
}
