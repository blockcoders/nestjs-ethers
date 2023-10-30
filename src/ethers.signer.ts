import {
  VoidSigner,
  BytesLike,
  ProgressCallback,
  AbstractProvider,
  SigningKey,
  Wallet,
  HDNodeWallet,
  Mnemonic,
} from 'ethers'

export class EthersSigner {
  private readonly provider: AbstractProvider

  constructor(provider: AbstractProvider) {
    this.provider = provider
  }

  createWallet(privateKey: string | SigningKey): Wallet {
    return new Wallet(privateKey, this.provider)
  }

  createRandomWallet(): HDNodeWallet {
    return Wallet.createRandom(this.provider)
  }

  async createWalletFromEncryptedJson(
    jsonString: string,
    password: BytesLike,
    progressCallback?: ProgressCallback,
  ): Promise<HDNodeWallet | Wallet> {
    const wallet = await Wallet.fromEncryptedJson(jsonString, password, progressCallback)

    return wallet.connect(this.provider)
  }

  createWalletfromMnemonic(mnemonic: Mnemonic, path?: string): HDNodeWallet {
    const wallet = HDNodeWallet.fromMnemonic(mnemonic, path)

    return wallet.connect(this.provider)
  }

  createVoidSigner(address: string): VoidSigner {
    return new VoidSigner(address, this.provider)
  }
}
