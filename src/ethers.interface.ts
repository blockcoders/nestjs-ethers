import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Network } from '@ethersproject/providers';

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
  cloudflare?: string;
  infura?: InfuraProviderOptions | string;
  pocket?: PocketProviderOptions | string;
  quorum?: number;
  useCloudflareProvider?: boolean;
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
