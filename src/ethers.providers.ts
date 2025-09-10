import { Provider } from '@nestjs/common'
import {
  AbstractProvider,
  AlchemyProvider,
  AnkrProvider,
  CloudflareProvider,
  EtherscanProvider,
  FetchRequest,
  InfuraProvider,
  JsonRpcProvider,
  PocketProvider,
} from 'ethers'
import { defer, lastValueFrom } from 'rxjs'
import { ETHERS_MODULE_OPTIONS, MAINNET_NETWORK } from './ethers.constants'
import { EthersContract } from './ethers.contract'
import {
  BinancePocketProvider,
  BscscanProvider,
  getFallbackProvider,
  getNetworkDefaultProvider,
  MoralisProvider,
} from './ethers.custom-rpcs'
import { EthersModuleAsyncOptions, EthersModuleOptions } from './ethers.interface'
import { EthersSigner } from './ethers.signer'
import { getContractToken, getEthersToken, getNetwork, getSignerToken, isBinanceNetwork } from './ethers.utils'

export async function createAbstractProvider(
  options: EthersModuleOptions,
): Promise<AbstractProvider | AbstractProvider> {
  const {
    network = MAINNET_NETWORK,
    quorum = 1,
    useDefaultProvider = true,
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

  const providerNetwork = getNetwork(network)

  if (!useDefaultProvider) {
    const providers: Array<AbstractProvider> = []

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
      providers.push(new InfuraProvider(providerNetwork, infura?.projectId, infura?.projectSecret))
    }

    if (pocket) {
      if (isBinanceNetwork(providerNetwork)) {
        providers.push(new BinancePocketProvider(providerNetwork, pocket?.applicationId, pocket?.applicationSecretKey))
      } else {
        providers.push(new PocketProvider(providerNetwork, pocket?.applicationId, pocket?.applicationSecretKey))
      }
    }

    if (moralis) {
      providers.push(new MoralisProvider(providerNetwork, moralis?.apiKey, moralis?.region))
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
      const customInfos: (string | FetchRequest)[] = !Array.isArray(custom) ? [custom] : custom

      customInfos.forEach((customInfo) => {
        providers.push(new JsonRpcProvider(customInfo, providerNetwork))
      })
    }

    return getFallbackProvider(providers, quorum)
  }

  /**
   * The default provider is the safest, easiest way to begin developing on Ethereum
   * It creates a FallbackProvider connected to as many backend services as possible.
   * @see {@link https://docs.ethers.org/v6/api/providers/#getDefaultProvider}
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
    useFactory: async (): Promise<AbstractProvider> => {
      return await lastValueFrom(defer(() => createAbstractProvider(options)))
    },
  }
}

export function createEthersAsyncProvider(token?: string): Provider {
  return {
    provide: getEthersToken(token),
    useFactory: async (options: EthersModuleOptions): Promise<AbstractProvider> => {
      return await lastValueFrom(defer(() => createAbstractProvider(options)))
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
