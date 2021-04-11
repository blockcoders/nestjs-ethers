import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Networkish } from '@ethersproject/providers';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
} from './interfaces/ethers-options.interface';

@Global()
@Module({})
export class EthersCoreModule implements OnApplicationShutdown {
  static forRoot(
    network: Networkish = 'homestead',
    options: EthersModuleOptions = {},
  ): DynamicModule {
    return {
      module: EthersCoreModule,
      providers: [],
      exports: [],
    };
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    return {
      module: EthersCoreModule,
      imports: options.imports,
      providers: [],
      exports: [],
    };
  }

  async onApplicationShutdown(signal?: string) {
    throw new Error('Method not implemented.');
  }
}
