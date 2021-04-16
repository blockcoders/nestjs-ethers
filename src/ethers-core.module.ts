import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BaseProvider } from '@ethersproject/providers';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
} from './ethers.interface';
import {
  createEthersProvider,
  createEthersAsyncProvider,
  createAsyncOptionsProvider,
  createProviderName,
} from './ethers.providers';
import { ETHERS_PROVIDER_NAME } from './ethers.constants';
import { EthersSigner } from './ethers.signer';

@Global()
@Module({ providers: [EthersSigner], exports: [EthersSigner] })
export class EthersCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(ETHERS_PROVIDER_NAME) private readonly providerName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: EthersModuleOptions = {}): DynamicModule {
    const ethersProvider = createEthersProvider(options);
    const providerName = options?.providerName ?? '';

    return {
      module: EthersCoreModule,
      providers: [
        EthersSigner,
        ethersProvider,
        createProviderName(providerName),
      ],
      exports: [EthersSigner, ethersProvider],
    };
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    const providerName = options?.providerName ?? '';
    const ethersProvider = createEthersAsyncProvider(providerName);
    const asyncOptionsProvider = createAsyncOptionsProvider(options);

    return {
      module: EthersCoreModule,
      imports: options.imports,
      providers: [
        EthersSigner,
        asyncOptionsProvider,
        ethersProvider,
        createProviderName(providerName),
        ...(options.providers || []),
      ],
      exports: [EthersSigner, ethersProvider],
    };
  }

  async onApplicationShutdown() {
    const provider = this.moduleRef.get<BaseProvider>(this.providerName);

    if (provider) {
      provider.removeAllListeners();
    }
  }
}
