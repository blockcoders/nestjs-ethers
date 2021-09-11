import { Module, DynamicModule } from '@nestjs/common'
import { EthersCoreModule } from './ethers-core.module'
import { EthersModuleOptions, EthersModuleAsyncOptions } from './ethers.interface'

@Module({})
export class EthersModule {
  static forRoot(options: EthersModuleOptions = {}): DynamicModule {
    return {
      module: EthersModule,
      imports: [EthersCoreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    return {
      module: EthersModule,
      imports: [EthersCoreModule.forRootAsync(options)],
    }
  }
}
