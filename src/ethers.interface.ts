import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Network } from '@ethersproject/providers';
import { BytesLike } from '@ethersproject/bytes';
import { Wordlist } from '@ethersproject/wordlists';

export type WordlistLike = string | Wordlist;

export interface InfuraProviderOptions {
  projectId?: string;
  projectSecret?: string;
}

export interface PocketProviderOptions {
  applicationId?: string;
  applicationSecretKey?: string;
}

export interface EthersModuleOptions extends Record<string, any> {
  network?: Network | string;
  providerName?: string;
  alchemy?: string;
  etherscan?: string;
  cloudflare?: boolean;
  infura?: InfuraProviderOptions | string;
  pocket?: PocketProviderOptions | string;
  quorum?: number;
  useDefaultProvider?: boolean;
}

export interface EthersModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  providerName?: string;
  useFactory: (
    ...args: any[]
  ) => EthersModuleOptions | Promise<EthersModuleOptions>;
  inject?: any[];
}

export interface EthersOptionsFactory {
  createEthersOptions(): Promise<EthersModuleOptions> | EthersModuleOptions;
}

export interface RandomWalletSignerOptions {
  extraEntropy?: BytesLike;
  locale: WordlistLike;
  path: string;
}
