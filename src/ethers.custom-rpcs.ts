import { providers as multicall } from '@0xsequence/multicall'
import {
  BaseProvider,
  EtherscanProvider,
  FallbackProvider,
  getDefaultProvider,
  Network,
  Networkish,
  PocketProvider,
  UrlJsonRpcProvider,
} from '@ethersproject/providers'
import { ConnectionInfo } from '@ethersproject/web'
import {
  BINANCE_NETWORK,
  BINANCE_POCKET_DEFAULT_APP_ID,
  BINANCE_TESTNET_NETWORK,
  BSCSCAN_DEFAULT_API_KEY,
  GOERLI_NETWORK,
  MAINNET_NETWORK,
  SEPOLIA_NETWORK,
} from './ethers.constants'
import { MoralisProviderOptions, PocketProviderOptions, ProviderOptions } from './ethers.interface'
import { getNetwork, isBinanceNetwork } from './ethers.utils'

export class BscscanProvider extends EtherscanProvider {
  constructor(_network: Networkish, apiKey?: string) {
    const network = getNetwork(_network)

    super(network.chainId, apiKey || BSCSCAN_DEFAULT_API_KEY)
  }

  getBaseUrl(): string {
    switch (this.network.chainId) {
      case BINANCE_NETWORK.chainId:
        return 'https://api.bscscan.com'
      case BINANCE_TESTNET_NETWORK.chainId:
        return 'https://api-testnet.bscscan.com'
    }

    throw new Error(`unsupported network ${this.network.name}`)
  }

  isCommunityResource(): boolean {
    return this.apiKey === BSCSCAN_DEFAULT_API_KEY
  }
}

export class BinancePocketProvider extends PocketProvider {
  constructor(_network: Networkish, apiKey?: PocketProviderOptions | string) {
    const network = getNetwork(_network)

    super(network.chainId, apiKey || { applicationId: BINANCE_POCKET_DEFAULT_APP_ID, loadBalancer: true })
  }

  static getUrl(network: Network, apiKey: PocketProviderOptions): ConnectionInfo {
    let host: string | null = null
    switch (network.chainId) {
      case BINANCE_NETWORK.chainId:
        host = 'bsc-mainnet.gateway.pokt.network'
        break
      // Binance Testnet Claimed RelayChain
      case BINANCE_TESTNET_NETWORK.chainId:
        host = 'bsc-testnet.gateway.pokt.network'
        break
      default:
        throw new Error(`unsupported network ${network.name}`)
    }

    const url = `https:/\/${host}/v1/lb/${apiKey.applicationId}`

    const connection: ConnectionInfo = { url, headers: {} }

    // Apply application secret key
    if (apiKey.applicationSecretKey != null) {
      connection.user = ''
      connection.password = apiKey.applicationSecretKey
    }

    return connection
  }

  isCommunityResource(): boolean {
    return this.applicationId === BINANCE_POCKET_DEFAULT_APP_ID
  }
}

export class MoralisProvider extends UrlJsonRpcProvider {
  static getApiKey(apiKey: MoralisProviderOptions | string): MoralisProviderOptions {
    const options: MoralisProviderOptions = {
      apiKey: typeof apiKey === 'string' ? apiKey : apiKey.apiKey,
      region: typeof apiKey === 'string' ? 'nyc' : apiKey.region ?? 'nyc',
    }

    if (!options.apiKey) {
      throw new Error('Invalid moralis apiKey')
    }

    return options
  }

  static getConnectionInfo(options: MoralisProviderOptions, endpoint: string): ConnectionInfo {
    return {
      url: `https://speedy-nodes-${options.region}.moralis.io/${options.apiKey}/${endpoint}`,
      headers: {},
    }
  }
}

export class BinanceMoralisProvider extends MoralisProvider {
  constructor(_network: Networkish, apiKey?: MoralisProviderOptions | string) {
    const network = getNetwork(_network)

    super(network, apiKey)
  }

  static getUrl(network: Network, apiKey: MoralisProviderOptions): ConnectionInfo {
    let endpoint: string
    switch (network.chainId) {
      case BINANCE_NETWORK.chainId:
        endpoint = 'bsc/mainnet'
        break
      case BINANCE_TESTNET_NETWORK.chainId:
        endpoint = 'bsc/testnet'
        break
      default:
        throw new Error(`unsupported network ${network.name}`)
    }

    return MoralisProvider.getConnectionInfo(MoralisProvider.getApiKey(apiKey), endpoint)
  }
}

export class EthereumMoralisProvider extends MoralisProvider {
  constructor(_network: Networkish, apiKey?: MoralisProviderOptions | string) {
    const network = getNetwork(_network)

    super(network, apiKey)
  }

  static getUrl(network: Network, apiKey: MoralisProviderOptions): ConnectionInfo {
    let endpoint: string
    switch (network.chainId) {
      case MAINNET_NETWORK.chainId:
        endpoint = 'eth/mainnet'
        break
      case GOERLI_NETWORK.chainId:
        endpoint = 'eth/goerli'
        break
      case SEPOLIA_NETWORK.chainId:
        endpoint = 'eth/sepolia'
        break
      default:
        throw new Error(`unsupported network ${network.name}`)
    }

    return MoralisProvider.getConnectionInfo(MoralisProvider.getApiKey(apiKey), endpoint)
  }
}

export async function getFallbackProvider(
  providers: BaseProvider[] = [],
  quorum = 1,
  waitUntilIsConnected = true,
): Promise<FallbackProvider | BaseProvider> {
  if (providers.length < 1) {
    throw new Error(
      'Error in provider creation. The property "useDefaultProvider" is false and the providers supplied are invalid.',
    )
  }

  if (waitUntilIsConnected) {
    // wait until the node is up and running smoothly.
    await Promise.all(providers.map((provider) => provider.ready))
  }

  if (providers.length > 1) {
    /**
     * FallbackProvider with selected providers.
     * @see {@link https://docs.ethers.io/v5/api/providers/other/#FallbackProvider}
     */
    return new FallbackProvider(providers, quorum)
  }

  return providers[0]
}

export async function getBinanceDefaultProvider(
  network: Network,
  options?: Pick<ProviderOptions, 'bscscan' | 'pocket' | 'moralis' | 'quorum'>,
) {
  const providers: Array<BaseProvider> = [
    new BscscanProvider(network, options?.bscscan),
    new BinancePocketProvider(network, options?.pocket),
  ]

  if (options?.moralis) {
    providers.push(new BinanceMoralisProvider(network, options.moralis))
  }

  return getFallbackProvider(providers, options?.quorum ?? Math.min(providers.length, 2), true)
}

export async function getNetworkDefaultProvider(network: Network, options: ProviderOptions = {}) {
  if (isBinanceNetwork(network)) {
    return getBinanceDefaultProvider(network, options)
  }

  return getDefaultProvider(network, options)
}

export async function getMulticallProvider(provider: FallbackProvider | BaseProvider) {
  return new multicall.MulticallProvider(provider)
}
