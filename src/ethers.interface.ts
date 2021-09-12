import { BytesLike } from '@ethersproject/bytes'
import { Networkish } from '@ethersproject/networks'
import { Wordlist } from '@ethersproject/wordlists'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ConnectionInfo } from 'ethers/lib/utils'

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
  bscscan?: string | undefined
  custom?: ConnectionInfo | string | (ConnectionInfo | string)[] | undefined
  quorum?: number | undefined
  waitUntilIsConnected?: boolean | undefined
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
