import { Module, DynamicModule } from '@nestjs/common';
import { Networkish } from '@ethersproject/providers';
import { EthersCoreModule } from './ethers-core.module';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
} from './interfaces/ethers-options.interface';

@Module({})
export class EthersModule {
  static forRoot(
    network: Networkish = 'homestead',
    options: EthersModuleOptions = {},
  ): DynamicModule {
    return {
      module: EthersModule,
      imports: [EthersCoreModule.forRoot(network, options)],
    };
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    return {
      module: EthersModule,
      imports: [EthersCoreModule.forRootAsync(options)],
    };
  }
}
