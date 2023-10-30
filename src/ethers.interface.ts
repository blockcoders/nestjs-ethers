import { ModuleMetadata } from '@nestjs/common/interfaces'
import type { Networkish } from 'ethers'

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

export interface ProviderOptions {
  alchemy?: string | undefined
  etherscan?: string | undefined
  bscscan?: string | undefined
  cloudflare?: boolean | undefined
  infura?: InfuraProviderOptions | undefined
  pocket?: PocketProviderOptions | undefined
  moralis?: MoralisProviderOptions | undefined
  ankr?: string | undefined
  custom?: string | string[] | undefined
  quorum?: number | undefined
}

export interface EthersModuleOptions extends ProviderOptions {
  network?: Networkish | undefined
  token?: string | undefined
  useDefaultProvider?: boolean | undefined
}

export interface EthersModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  token?: string | undefined
  useFactory: (...args: any[]) => Omit<EthersModuleOptions, 'token'> | Promise<Omit<EthersModuleOptions, 'token'>>
  inject?: any[]
}
