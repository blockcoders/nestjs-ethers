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

export interface AnkrProviderOptions {
  apiKey?: string
  projectSecret?: string
}

export interface ProviderOptions {
  alchemy?: string | undefined
  etherscan?: string | undefined
  bscscan?: string | undefined
  cloudflare?: boolean | undefined
  infura?: InfuraProviderOptions | string | undefined
  pocket?: PocketProviderOptions | string | undefined
  moralis?: MoralisProviderOptions | string | undefined
  ankr?: AnkrProviderOptions | string | undefined
  custom?: ConnectionInfo | string | (ConnectionInfo | string)[] | undefined
  quorum?: number | undefined
}

export interface EthersModuleOptions extends ProviderOptions {
  network?: Networkish | undefined
  token?: string | undefined
  waitUntilIsConnected?: boolean | undefined
  useDefaultProvider?: boolean | undefined
  disableEthersLogger?: boolean | undefined
}

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
