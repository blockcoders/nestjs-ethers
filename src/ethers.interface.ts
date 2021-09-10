import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Network } from '@ethersproject/providers';
import { BytesLike } from '@ethersproject/bytes';
import { Wordlist } from '@ethersproject/wordlists';
import { ConnectionInfo } from 'ethers/lib/utils';

export type WordlistLike = string | Wordlist;

export interface InfuraProviderOptions {
  projectId?: string;
  projectSecret?: string;
}

export interface PocketProviderOptions {
  applicationId?: string;
  applicationSecretKey?: string;
}

export interface CustomRpcProvider {
  url?: ConnectionInfo | string;
  network?: Network | string | number;
}

export interface EthersModuleOptions extends Record<string, any> {
  network?: Network | string;
  alchemy?: string;
  etherscan?: string;
  bsccsan?: string;
  cloudflare?: boolean;
  infura?: InfuraProviderOptions | string;
  pocket?: PocketProviderOptions | string;
  custom?: CustomRpcProvider | CustomRpcProvider[];
  quorum?: number;
  context?: string;
  waitUntilIsConnected?: boolean;
  useDefaultProvider?: boolean;
}

export interface EthersModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  context?: string;
  useFactory: (
    ...args: any[]
  ) =>
    | Omit<EthersModuleOptions, 'context'>
    | Promise<Omit<EthersModuleOptions, 'context'>>;
  inject?: any[];
}

export interface RandomWalletSignerOptions {
  extraEntropy?: BytesLike;
  locale: WordlistLike;
  path: string;
}
