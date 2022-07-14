import {
  Provider as AbstractProvider,
  BaseProvider,
  getDefaultProvider,
  AlchemyProvider,
  CloudflareProvider,
  EtherscanProvider,
  InfuraProvider,
  PocketProvider,
  StaticJsonRpcProvider,
} from '@ethersproject/providers'
import { ConnectionInfo } from '@ethersproject/web'
import { Provider } from '@nestjs/common'
import { defer, lastValueFrom } from 'rxjs'
import { ETHERS_MODULE_OPTIONS, MAINNET_NETWORK, BINANCE_NETWORK, MATIC_NETWORK } from './ethers.constants'
import { EthersContract } from './ethers.contract'
import {
  BinanceMoralisProvider,
  BinancePocketProvider,
  BscscanProvider,
  EthereumMoralisProvider,
  getBinanceDefaultProvider,
  getFallbackProvider,
} from './ethers.custom-rpcs'
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
  EthereumModuleOptions,
  BinanceModuleOptions,
  MaticModuleOptions,
} from './ethers.interface'
import { EthersSigner } from './ethers.signer'
import {
  getEthersToken,
  getContractToken,
  getSignerToken,
  getNetwork,
  isBinanceOptions,
  isPolygonOptions,
} from './ethers.utils'

export async function createBaseProvider(options: EthersModuleOptions): Promise<BaseProvider | AbstractProvider> {
  const { network = MAINNET_NETWORK, quorum = 1, waitUntilIsConnected = true, useDefaultProvider = true } = options
  const parseOptions = { ...options, network, quorum, waitUntilIsConnected, useDefaultProvider }

  if (isBinanceOptions(parseOptions)) {
    return createBinanceProvider(parseOptions)
  }

  if (isPolygonOptions(parseOptions)) {
    return createBinanceProvider(parseOptions)
  }

  return createEthereumProvider(parseOptions)
}

async function createEthereumProvider(options: EthereumModuleOptions): Promise<BaseProvider | AbstractProvider> {
  const {
    network = MAINNET_NETWORK,
    alchemy,
    etherscan,
    infura,
    pocket,
    moralis,
    cloudflare = false,
    custom,
    quorum,
    waitUntilIsConnected,
    useDefaultProvider,
  } = options

  const providerNetwork = getNetwork(network)

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = []

    if (alchemy) {
      providers.push(new AlchemyProvider(providerNetwork, alchemy))
    }

    if (etherscan) {
      providers.push(new EtherscanProvider(providerNetwork, etherscan))
    }

    if (infura) {
      providers.push(new InfuraProvider(providerNetwork, infura))
    }

    if (pocket) {
      providers.push(new PocketProvider(providerNetwork, pocket))
    }

    if (moralis) {
      providers.push(new EthereumMoralisProvider(providerNetwork, moralis))
    }

    if (cloudflare) {
      if (providerNetwork.chainId !== MAINNET_NETWORK.chainId) {
        throw new Error(`Invalid network. Cloudflare only supports ${MAINNET_NETWORK.name}.`)
      }

      providers.push(new CloudflareProvider(providerNetwork))
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
  return getDefaultProvider(providerNetwork, {
    alchemy,
    etherscan,
    infura,
    pocket,
    quorum,
  })
}

async function createBinanceProvider(options: BinanceModuleOptions): Promise<BaseProvider | AbstractProvider> {
  const {
    network = BINANCE_NETWORK,
    bscscan,
    pocket,
    moralis,
    custom,
    quorum,
    waitUntilIsConnected,
    useDefaultProvider,
  } = options

  const providerNetwork = getNetwork(network)

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = []

    if (pocket) {
      providers.push(new BinancePocketProvider(providerNetwork, pocket))
    }

    if (moralis) {
      providers.push(new BinanceMoralisProvider(providerNetwork, moralis))
    }

    if (bscscan) {
      providers.push(new BscscanProvider(providerNetwork, bscscan))
    }

    if (custom) {
      const customInfos: (ConnectionInfo | string)[] = !Array.isArray(custom) ? [custom] : custom

      customInfos.forEach((customInfo) => {
        providers.push(new StaticJsonRpcProvider(customInfo, providerNetwork))
      })
    }

    return getFallbackProvider(providers, quorum, waitUntilIsConnected)
  }

  return getBinanceDefaultProvider(providerNetwork, {
    bscscan,
    pocket,
    moralis,
  })
}

async function createPolygonProvider(options: MaticModuleOptions): Promise<BaseProvider | AbstractProvider> {
  const { network = MATIC_NETWORK, alchemy, infura, custom, quorum, waitUntilIsConnected, useDefaultProvider } = options
  const providerNetwork = getNetwork(network)

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = []

    if (alchemy) {
      providers.push(new AlchemyProvider(providerNetwork, alchemy))
    }

    if (infura) {
      providers.push(new InfuraProvider(providerNetwork, infura))
    }

    if (custom) {
      const customInfos: (ConnectionInfo | string)[] = !Array.isArray(custom) ? [custom] : custom

      customInfos.forEach((customInfo) => {
        providers.push(new StaticJsonRpcProvider(customInfo, providerNetwork))
      })
    }

    return getFallbackProvider(providers, quorum, waitUntilIsConnected)
  }
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
