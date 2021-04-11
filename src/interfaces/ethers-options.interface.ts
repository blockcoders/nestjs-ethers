import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Networkish } from '@ethersproject/providers';

interface InfuraProviderOptions {
  projectId: string;
  projectSecret: string;
}

interface PocketProviderOptions {
  applicationId: string;
  applicationSecretKey: string;
}

interface DefaultProviderOptions {
  alchemy?: string;
  etherscan?: string;
  infura?: InfuraProviderOptions | string;
  pocket?: PocketProviderOptions | string;
  quorum?: number;
}

export interface EthersModuleOptions extends Record<string, any> {
  network?: Networkish;
  options?: DefaultProviderOptions;
}

export interface EthersModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (
    ...args: any[]
  ) => EthersModuleOptions | Promise<EthersModuleOptions>;
  inject?: any[];
}
