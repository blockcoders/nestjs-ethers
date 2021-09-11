import { ExternallyOwnedAccount, VoidSigner } from '@ethersproject/abstract-signer'
import { BytesLike } from '@ethersproject/bytes'
import { ProgressCallback } from '@ethersproject/json-wallets'
import { BaseProvider } from '@ethersproject/providers'
import { SigningKey } from '@ethersproject/signing-key'
import { Wallet as WalletSigner } from '@ethersproject/wallet'
import { Wordlist } from '@ethersproject/wordlists'
import { Injectable } from '@nestjs/common'
import { InjectEthersProvider } from './ethers.decorators'
import { RandomWalletSignerOptions } from './ethers.interface'

@Injectable()
export class EthersSigner {
  constructor(@InjectEthersProvider() private readonly provider: BaseProvider) {}

  createWallet(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey): WalletSigner {
    return new WalletSigner(privateKey, this.provider)
  }

  createRandomWallet(options?: RandomWalletSignerOptions): WalletSigner {
    const wallet = WalletSigner.createRandom(options) as WalletSigner

    return wallet.connect(this.provider)
  }

  async createWalletfromEncryptedJson(
    jsonString: string,
    password: BytesLike,
    progressCallback?: ProgressCallback,
  ): Promise<WalletSigner> {
    const wallet = await WalletSigner.fromEncryptedJson(jsonString, password, progressCallback)

    return wallet.connect(this.provider)
  }

  createWalletfromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): WalletSigner {
    const wallet = WalletSigner.fromMnemonic(mnemonic, path, wordlist) as WalletSigner

    return wallet.connect(this.provider)
  }

  createVoidSigner(address: string): VoidSigner {
    return new VoidSigner(address, this.provider)
  }
}
