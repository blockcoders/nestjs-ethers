import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Network } from '@ethersproject/providers';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
} from './ethers.interface';
import {
  createEthersProvider,
  createcreateEthersAsyncProviders,
} from './ethers.providers';

@Global()
@Module({})
export class EthersCoreModule implements OnApplicationShutdown {
  static forRoot(
    network: Network | string = 'homestead',
    options: EthersModuleOptions = {},
  ): DynamicModule {
    const ethersProvider = createEthersProvider(network, options);

    return {
      module: EthersCoreModule,
      providers: [ethersProvider],
      exports: [ethersProvider],
    };
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    const ethersProvider = createcreateEthersAsyncProviders(
      options?.providerName ?? '',
    );

    return {
      module: EthersCoreModule,
      imports: options.imports,
      providers: [ethersProvider],
      exports: [ethersProvider],
    };
  }

  async onApplicationShutdown(signal?: string) {
    throw new Error('Method not implemented.');
  }
}
