import {
  AbstractProvider,
  EtherscanProvider,
  FallbackProvider,
  getDefaultProvider,
  Network,
  Networkish,
  JsonRpcProvider,
  FetchRequest,
} from 'ethers'
import {
  BINANCE_NETWORK,
  BINANCE_POCKET_DEFAULT_APP_ID,
  BINANCE_TESTNET_NETWORK,
  BSCSCAN_DEFAULT_API_KEY,
  GOERLI_NETWORK,
  MAINNET_NETWORK,
  SEPOLIA_NETWORK,
} from './ethers.constants'
import { ProviderOptions } from './ethers.interface'
import { getNetwork, isBinanceNetwork } from './ethers.utils'

export class BscscanProvider extends EtherscanProvider {
  constructor(_network: Networkish, apiKey?: string) {
    const network = getNetwork(_network)

    super(network.chainId, apiKey || BSCSCAN_DEFAULT_API_KEY)
  }

  getBaseUrl(): string {
    switch (this.network.name) {
      case BINANCE_NETWORK.name:
        return 'https://api.bscscan.com'
      case BINANCE_TESTNET_NETWORK.name:
        return 'https://api-testnet.bscscan.com'
    }

    throw new Error(`unsupported network ${this.network.name}`)
  }

  isCommunityResource(): boolean {
    return this.apiKey === BSCSCAN_DEFAULT_API_KEY
  }
}

export class BinancePocketProvider extends JsonRpcProvider {
  readonly applicationId!: string
  readonly applicationSecret!: null | string

  constructor(_network?: Networkish, applicationId?: null | string, applicationSecret?: null | string) {
    const network = Network.from(_network)

    if (applicationId == null) {
      applicationId = BINANCE_POCKET_DEFAULT_APP_ID
    }

    if (applicationSecret == null) {
      applicationSecret = null
    }

    const options = { staticNetwork: network }

    const request = BinancePocketProvider.getRequest(network, applicationId, applicationSecret)
    super(request, network, options)

    this.applicationId = applicationId
    this.applicationSecret = applicationSecret
  }

  static getHost(name: string): string {
    switch (name) {
      case BINANCE_NETWORK.name:
        return 'bsc-mainnet.gateway.pokt.network'
      case BINANCE_TESTNET_NETWORK.name:
        return 'bsc-testnet.gateway.pokt.network'
      default:
        throw new Error(`unsupported network ${name}`)
    }
  }

  _getProvider(chainId: number): AbstractProvider {
    try {
      return new BinancePocketProvider(chainId, this.applicationId, this.applicationSecret)
    } catch (error) {}
    return super._getProvider(chainId)
  }

  static getRequest(network: Network, applicationId?: null | string, applicationSecret?: null | string): FetchRequest {
    if (applicationId == null) {
      applicationId = BINANCE_POCKET_DEFAULT_APP_ID
    }

    const request = new FetchRequest(`https:/\/${BinancePocketProvider.getHost(network.name)}/v1/lb/${applicationId}`)
    request.allowGzip = true

    if (applicationSecret) {
      request.setCredentials('', applicationSecret)
    }

    return request
  }

  isCommunityResource(): boolean {
    return this.applicationId === BINANCE_POCKET_DEFAULT_APP_ID
  }
}

export class MoralisProvider extends JsonRpcProvider {
  public readonly applicationId: string
  public readonly region: string

  constructor(_network?: Networkish, applicationId?: string, region?: string) {
    if (!_network) {
      _network = 'mainnet'
    }
    const network = Network.from(_network)

    if (!applicationId) {
      throw new Error('Invalid moralis apiKey')
    }

    if (!region) {
      region = 'nyc'
    }

    const options = { staticNetwork: network }

    const request = MoralisProvider.getRequest(network, applicationId, region)

    super(request, network, options)

    this.applicationId = applicationId
    this.region = region
  }

  _getProvider(chainId: number): AbstractProvider {
    try {
      return new MoralisProvider(chainId, this.applicationId, this.region)
    } catch (error) {}
    return super._getProvider(chainId)
  }

  static getRequest(network: Network, applicationId: string, region: string): FetchRequest {
    let endpoint: string

    switch (network.name) {
      case BINANCE_NETWORK.name:
        endpoint = 'bsc/mainnet'
        break
      case BINANCE_TESTNET_NETWORK.name:
        endpoint = 'bsc/testnet'
        break
      case MAINNET_NETWORK.name:
        endpoint = 'eth/mainnet'
        break
      case GOERLI_NETWORK.name:
        endpoint = 'eth/goerli'
        break
      case SEPOLIA_NETWORK.name:
        endpoint = 'eth/sepolia'
        break
      default:
        throw new Error(`unsupported network ${network.name}`)
    }

    const request = new FetchRequest(`https://speedy-nodes-${region}.moralis.io/${applicationId}/${endpoint}`)

    request.allowGzip = true

    return request
  }
}

export async function getFallbackProvider(
  providers: AbstractProvider[] = [],
  quorum = 1,
): Promise<FallbackProvider | AbstractProvider> {
  if (providers.length < 1) {
    throw new Error(
      'Error in provider creation. The property "useDefaultProvider" is false and the providers supplied are invalid.',
    )
  }

  if (providers.length > 1) {
    /**
     * FallbackProvider with selected providers.
     * @see {@link https://docs.ethers.io/v5/api/providers/other/#FallbackProvider}
     */
    return new FallbackProvider(providers, undefined, { quorum })
  }

  return providers[0]
}

export async function getBinanceDefaultProvider(
  network: Network,
  options?: Pick<ProviderOptions, 'bscscan' | 'pocket' | 'moralis' | 'quorum'>,
) {
  const providers: Array<AbstractProvider> = [
    new BscscanProvider(network, options?.bscscan),
    new BinancePocketProvider(network, options?.pocket?.applicationId, options?.pocket?.applicationSecretKey),
  ]

  if (options?.moralis) {
    providers.push(new MoralisProvider(network, options?.moralis?.apiKey, options?.moralis?.region))
  }

  return getFallbackProvider(providers, options?.quorum ?? Math.min(providers.length, 2))
}

export async function getNetworkDefaultProvider(network: Network, options: ProviderOptions = {}) {
  if (isBinanceNetwork(network)) {
    return getBinanceDefaultProvider(network, options)
  }

  return getDefaultProvider(network, options)
}
