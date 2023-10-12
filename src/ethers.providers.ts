import { Logger, LogLevel } from '@ethersproject/logger'
import {
  Provider as AbstractProvider,
  BaseProvider,
  AlchemyProvider,
  CloudflareProvider,
  EtherscanProvider,
  InfuraProvider,
  PocketProvider,
  StaticJsonRpcProvider,
  AnkrProvider,
} from '@ethersproject/providers'
import { ConnectionInfo } from '@ethersproject/web'
import { Provider } from '@nestjs/common'
import { defer, lastValueFrom } from 'rxjs'
import { ETHERS_MODULE_OPTIONS, MAINNET_NETWORK } from './ethers.constants'
import { EthersContract } from './ethers.contract'
import {
  BinanceMoralisProvider,
  BinancePocketProvider,
  BscscanProvider,
  EthereumMoralisProvider,
  getFallbackProvider,
  getNetworkDefaultProvider,
} from './ethers.custom-rpcs'
import { EthersModuleOptions, EthersModuleAsyncOptions } from './ethers.interface'
import { EthersSigner } from './ethers.signer'
import { getEthersToken, getContractToken, getSignerToken, getNetwork, isBinanceNetwork } from './ethers.utils'

export async function createBaseProvider(options: EthersModuleOptions): Promise<BaseProvider | AbstractProvider> {
  const {
    network = MAINNET_NETWORK,
    quorum = 1,
    waitUntilIsConnected = true,
    useDefaultProvider = true,
    disableEthersLogger = false,
    alchemy,
    etherscan,
    bscscan,
    infura,
    pocket,
    moralis,
    ankr,
    cloudflare = false,
    custom,
  } = options

  if (disableEthersLogger) {
    Logger.setLogLevel(LogLevel.OFF)
  }

  const providerNetwork = getNetwork(network)

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = []

    if (alchemy) {
      providers.push(new AlchemyProvider(providerNetwork, alchemy))
    }

    if (etherscan) {
      providers.push(new EtherscanProvider(providerNetwork, etherscan))
    }

    if (bscscan) {
      providers.push(new BscscanProvider(providerNetwork, bscscan))
    }

    if (infura) {
      providers.push(new InfuraProvider(providerNetwork, infura))
    }

    if (pocket) {
      if (isBinanceNetwork(providerNetwork)) {
        providers.push(new BinancePocketProvider(providerNetwork, pocket))
      } else {
        providers.push(new PocketProvider(providerNetwork, pocket))
      }
    }

    if (moralis) {
      if (isBinanceNetwork(providerNetwork)) {
        providers.push(new BinanceMoralisProvider(providerNetwork, moralis))
      } else {
        providers.push(new EthereumMoralisProvider(providerNetwork, moralis))
      }
    }

    if (cloudflare) {
      if (providerNetwork.chainId !== MAINNET_NETWORK.chainId) {
        throw new Error(`Invalid network. Cloudflare only supports ${MAINNET_NETWORK.name}.`)
      }

      providers.push(new CloudflareProvider(providerNetwork))
    }

    if (ankr) {
      providers.push(new AnkrProvider(providerNetwork, ankr))
    }

    if (custom) {
      const customInfos: (ConnectionInfo | string)[] = !Array.isArray(custom) ? [custom] : custom

      customInfos.forEach((customInfo) => {
        providers.push(new StaticJsonRpcProvider(customInfo, providerNetwork))
      })
    }

    return getFallbackProvider(providers, quorum, waitUntilIsConnected)
  }

  /**
   * The default provider is the safest, easiest way to begin developing on Ethereum
   * It creates a FallbackProvider connected to as many backend services as possible.
   * @see {@link https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider}
   */
  return getNetworkDefaultProvider(providerNetwork, {
    alchemy,
    etherscan,
    bscscan,
    infura,
    pocket,
    moralis,
    ankr,
    quorum,
  })
}

export function createEthersProvider(options: EthersModuleOptions): Provider {
  return {
    provide: getEthersToken(options.token),
    useFactory: async (): Promise<BaseProvider | AbstractProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(options)))
    },
  }
}

export function createEthersAsyncProvider(token?: string): Provider {
  return {
    provide: getEthersToken(token),
    useFactory: async (options: EthersModuleOptions): Promise<BaseProvider | AbstractProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(options)))
    },
    inject: [ETHERS_MODULE_OPTIONS],
  }
}

export function createAsyncOptionsProvider(options: EthersModuleAsyncOptions): Provider {
  return {
    provide: ETHERS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject || [],
  }
}

export function createContractProvider(token?: string): Provider {
  return {
    provide: getContractToken(token),
    useFactory: async (provider: AbstractProvider): Promise<EthersContract> => {
      return await lastValueFrom(defer(async () => new EthersContract(provider)))
    },
    inject: [getEthersToken(token)],
  }
}

export function createSignerProvider(token?: string): Provider {
  return {
    provide: getSignerToken(token),
    useFactory: async (provider: AbstractProvider): Promise<EthersSigner> => {
      return await lastValueFrom(defer(async () => new EthersSigner(provider)))
    },
    inject: [getEthersToken(token)],
  }
}
