import { BytesLike } from '@ethersproject/bytes'
import { Networkish } from '@ethersproject/networks'
import { ConnectionInfo } from '@ethersproject/web'
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

export interface MoralisProviderOptions {
  apiKey?: string
  region?: string
}

export interface BaseModuleOptions {
  network?: Networkish | undefined
  custom?: ConnectionInfo | string | (ConnectionInfo | string)[] | undefined
  quorum?: number | undefined
  token?: string | undefined
  waitUntilIsConnected?: boolean | undefined
  useDefaultProvider?: boolean | undefined
}

export interface EthereumModuleOptions extends BaseModuleOptions {
  alchemy?: string | undefined
  etherscan?: string | undefined
  cloudflare?: boolean | undefined
  infura?: InfuraProviderOptions | string | undefined
  pocket?: PocketProviderOptions | string | undefined
  moralis?: MoralisProviderOptions | undefined
}

export interface BinanceModuleOptions extends BaseModuleOptions {
  bscscan?: string | undefined
  pocket?: PocketProviderOptions | string | undefined
  moralis?: MoralisProviderOptions | undefined
}

export interface MaticModuleOptions extends BaseModuleOptions {
  alchemy?: string | undefined
  infura?: InfuraProviderOptions | string | undefined
}

export type EthersModuleOptions = EthereumModuleOptions | BinanceModuleOptions | MaticModuleOptions

export interface EthersModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  token?: string | undefined
  useFactory: (...args: any[]) => Omit<EthersModuleOptions, 'token'> | Promise<Omit<EthersModuleOptions, 'token'>>
  inject?: any[]
}

export interface RandomWalletOptions {
  extraEntropy?: BytesLike
  locale: WordlistLike
  path: string
}
