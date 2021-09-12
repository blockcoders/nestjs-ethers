import {
  BscscanProvider,
  getDefaultProvider as getDefaultBscProvider,
  getNetwork as getBscNetwork,
} from '@ethers-ancillary/bsc'
import {
  Provider as BaseProvider,
  getDefaultProvider,
  FallbackProvider,
  AlchemyProvider,
  CloudflareProvider,
  EtherscanProvider,
  InfuraProvider,
  PocketProvider,
  getNetwork,
  Networkish,
  Network,
} from '@ethersproject/providers'
import { Provider } from '@nestjs/common'
import { defer, lastValueFrom } from 'rxjs'
import {
  ETHERS_MODULE_OPTIONS,
  ETHERS_PROVIDER_NAME,
  MAINNET_NETWORK,
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
} from './ethers.constants'
import { EthersModuleOptions, EthersModuleAsyncOptions } from './ethers.interface'
import { getEthersToken } from './ethers.utils'

function validateBscNetwork(network: Networkish) {
  if (typeof network === 'number') {
    return [BINANCE_NETWORK.chainId, BINANCE_TESTNET_NETWORK.chainId].includes(network)
  }

  if (typeof network === 'string') {
    return [BINANCE_NETWORK.name, BINANCE_TESTNET_NETWORK.name].includes(network)
  }

  return [BINANCE_NETWORK, BINANCE_TESTNET_NETWORK].includes(network)
}

export async function createBaseProvider(options: EthersModuleOptions = {}): Promise<BaseProvider> {
  const {
    network = MAINNET_NETWORK,
    alchemy,
    etherscan,
    infura,
    pocket,
    cloudflare = false,
    bsccsan,
    quorum = 1,
    useDefaultProvider = true,
  } = options

  let providerNetwork: Network | null
  const isBscNetwork = validateBscNetwork(network)

  if (isBscNetwork) {
    providerNetwork = getBscNetwork(network)
  } else {
    providerNetwork = getNetwork(network)
  }

  if (!providerNetwork) {
    throw new Error(`Invalid network ${network}.`)
  }

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = []

    if (alchemy) {
      const alchemyProvider = new AlchemyProvider(providerNetwork, alchemy)

      // wait until the node is up and running smoothly.
      await alchemyProvider.ready

      providers.push(alchemyProvider)
    }

    if (etherscan) {
      const etherscanProvider = new EtherscanProvider(providerNetwork, etherscan)

      // wait until the node is up and running smoothly.
      await etherscanProvider.ready

      providers.push(etherscanProvider)
    }

    if (infura) {
      const infuraProvider = new InfuraProvider(providerNetwork, infura)

      // wait until the node is up and running smoothly.
      await infuraProvider.ready

      providers.push(infuraProvider)
    }

    if (pocket) {
      const pocketProvider = new PocketProvider(providerNetwork, pocket)

      // wait until the node is up and running smoothly.
      await pocketProvider.ready

      providers.push(pocketProvider)
    }

    if (cloudflare) {
      if (providerNetwork.chainId !== MAINNET_NETWORK.chainId) {
        throw new Error(`Invalid network. Cloudflare only supports ${MAINNET_NETWORK.name}.`)
      }

      const cloudflareProvider = new CloudflareProvider(providerNetwork)

      // wait until the node is up and running smoothly.
      await cloudflareProvider.ready

      providers.push(cloudflareProvider)
    }

    if (bsccsan) {
      const bsccsanProvider = new BscscanProvider(providerNetwork, bsccsan)

      // wait until the node is up and running smoothly.
      await bsccsanProvider.ready

      providers.push(bsccsanProvider)
    }

    if (providers.length > 1) {
      /**
       * FallbackProvider with selected providers.
       * @see {@link https://docs.ethers.io/v5/api/providers/other/#FallbackProvider}
       */
      return new FallbackProvider(providers, quorum)
    }

    if (providers.length === 1) {
      return providers[0]
    }
  }

  if (useDefaultProvider && bsccsan && isBscNetwork) {
    return getDefaultBscProvider(providerNetwork, {
      bsccsan,
    })
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

export function createEthersProvider(options: EthersModuleOptions = {}): Provider {
  return {
    provide: getEthersToken(),
    useFactory: async (): Promise<BaseProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(options)))
    },
  }
}

export function createEthersAsyncProvider(): Provider {
  return {
    provide: getEthersToken(),
    useFactory: async (options: EthersModuleOptions): Promise<BaseProvider> => {
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

export function createProviderName(): Provider {
  return {
    provide: ETHERS_PROVIDER_NAME,
    useValue: getEthersToken(),
  }
}
