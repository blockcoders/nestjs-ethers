import { Provider as AbstractProvider } from '@ethersproject/providers'
import { DynamicModule, Global, Module, OnApplicationShutdown } from '@nestjs/common'
import { DiscoveryModule, DiscoveryService } from '@nestjs/core'
import { EthersContract } from './ethers.contract'
import { EthersModuleOptions, EthersModuleAsyncOptions } from './ethers.interface'
import {
  createEthersProvider,
  createEthersAsyncProvider,
  createAsyncOptionsProvider,
  createContractProvider,
  createSignerProvider,
} from './ethers.providers'
import { EthersSigner } from './ethers.signer'

@Global()
@Module({})
export class EthersCoreModule implements OnApplicationShutdown {
  constructor(private readonly discoveryService: DiscoveryService) {}

  static forRoot(options: EthersModuleOptions): DynamicModule {
    const ethersProvider = createEthersProvider(options)
    const contractProvider = createContractProvider(options.token)
    const signerProvider = createSignerProvider(options.token)

    return {
      module: EthersCoreModule,
      imports: [DiscoveryModule],
      providers: [EthersSigner, EthersContract, ethersProvider, contractProvider, signerProvider],
      exports: [EthersSigner, EthersContract, ethersProvider, contractProvider, signerProvider],
    }
  }

  static forRootAsync(options: EthersModuleAsyncOptions): DynamicModule {
    const ethersProvider = createEthersAsyncProvider(options.token)
    const asyncOptionsProvider = createAsyncOptionsProvider(options)
    const contractProvider = createContractProvider(options.token)
    const signerProvider = createSignerProvider(options.token)

    return {
      module: EthersCoreModule,
      imports: [DiscoveryModule, ...(options.imports || [])],
      providers: [
        EthersSigner,
        EthersContract,
        asyncOptionsProvider,
        ethersProvider,
        contractProvider,
        signerProvider,
        ...(options.providers || []),
      ],
      exports: [EthersSigner, EthersContract, ethersProvider, contractProvider, signerProvider],
    }
  }

  async onApplicationShutdown() {
    const providers = this.discoveryService.getProviders() ?? []

    providers.forEach((provider) => {
      const { instance } = provider ?? {}

      if (provider.isDependencyTreeStatic() && instance && instance instanceof AbstractProvider) {
        instance.removeAllListeners()
      }
    })
  }
}
