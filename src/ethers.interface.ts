import { BytesLike } from '@ethersproject/bytes'
import { Networkish } from '@ethersproject/networks'
import { Wordlist } from '@ethersproject/wordlists'
import { ModuleMetadata } from '@nestjs/common/interfaces'

export type WordlistLike = string | Wordlist

export interface InfuraProviderOptions {
  projectId?: string
  projectSecret?: string
}

export interface PocketProviderOptions {
  applicationId?: string
  applicationSecretKey?: string
}

export interface EthersModuleOptions extends Record<string, any> {
  network?: Networkish | undefined
  alchemy?: string | undefined
  etherscan?: string | undefined
  cloudflare?: boolean | undefined
  infura?: InfuraProviderOptions | string | undefined
  pocket?: PocketProviderOptions | string | undefined
  bsccsan?: string | undefined
  quorum?: number | undefined
  useDefaultProvider?: boolean | undefined
}

export interface EthersModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (...args: any[]) => EthersModuleOptions | Promise<EthersModuleOptions>
  inject?: any[]
}

export interface RandomWalletOptions {
  extraEntropy?: BytesLike
  locale: WordlistLike
  path: string
}
