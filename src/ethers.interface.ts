import { BytesLike } from '@ethersproject/bytes'
import { Network } from '@ethersproject/providers'
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
  network?: Network | string
  alchemy?: string
  etherscan?: string
  cloudflare?: boolean
  infura?: InfuraProviderOptions | string
  pocket?: PocketProviderOptions | string
  quorum?: number
  useDefaultProvider?: boolean
}

export interface EthersModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (...args: any[]) => EthersModuleOptions | Promise<EthersModuleOptions>
  inject?: any[]
}

export interface RandomWalletSignerOptions {
  extraEntropy?: BytesLike
  locale: WordlistLike
  path: string
}
