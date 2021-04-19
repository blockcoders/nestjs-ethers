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
import { EthersContract } from './ethers.contract';

@Global()
@Module({
  providers: [EthersSigner, EthersContract],
  exports: [EthersSigner, EthersContract],
})
export class EthersCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(ETHERS_PROVIDER_NAME) private readonly providerName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: EthersModuleOptions = {}): DynamicModule {
    const ethersProvider = createEthersProvider(options);

    return {
      module: EthersCoreModule,
      providers: [
        EthersSigner,
        EthersContract,
        ethersProvider,
        createProviderName(),
      ],
      exports: [EthersSigner, EthersContract, ethersProvider],
    };
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    const ethersProvider = createEthersAsyncProvider();
    const asyncOptionsProvider = createAsyncOptionsProvider(options);

    return {
      module: EthersCoreModule,
      imports: options.imports,
      providers: [
        EthersSigner,
        EthersContract,
        asyncOptionsProvider,
        ethersProvider,
        createProviderName(),
        ...(options.providers || []),
      ],
      exports: [EthersSigner, EthersContract, ethersProvider],
    };
  }

  async onApplicationShutdown() {
    const provider = this.moduleRef.get<BaseProvider>(this.providerName);

    if (provider) {
      provider.removeAllListeners();
    }
  }
}
