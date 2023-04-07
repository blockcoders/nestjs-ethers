import { providers as multicall } from '@0xsequence/multicall'
import {
  AlchemyProvider,
  AnkrProvider,
  CloudflareProvider,
  EtherscanProvider,
  FallbackProvider,
  InfuraProvider,
} from '@ethersproject/providers'
import * as nock from 'nock'
import {
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
  GOERLI_NETWORK,
  MAINNET_NETWORK,
  SEPOLIA_NETWORK,
} from '../src/ethers.constants'
import {
  BinanceMoralisProvider,
  BinancePocketProvider,
  BscscanProvider,
  EthereumMoralisProvider,
  getBinanceDefaultProvider,
  getFallbackProvider,
  getMulticallProvider,
  getNetworkDefaultProvider,
  MoralisProvider,
} from '../src/ethers.custom-rpcs'

describe('Ethers Custom RPC', () => {
  beforeEach(() => nock.cleanAll())

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.restore()
  })

  describe('BscscanProvider', () => {
    describe('getBaseUrl', () => {
      it('should return a bsc network url', async () => {
        const provider = new BscscanProvider(BINANCE_NETWORK)

        expect(provider.getBaseUrl()).toEqual('https://api.bscscan.com')
      })

      it('should return a bsc testnet network url', async () => {
        const provider = new BscscanProvider(BINANCE_TESTNET_NETWORK)

        expect(provider.getBaseUrl()).toEqual('https://api-testnet.bscscan.com')
      })

      it('should throw an error if the network is not valid', async () => {
        expect(() => new BscscanProvider(1)).toThrow()
      })
    })

    describe('isCommunityResource', () => {
      it('should return a bsc community resource', async () => {
        const provider = new BscscanProvider(BINANCE_NETWORK)

        expect(provider.isCommunityResource()).toBeTruthy()
      })

      it('should return a not bsc community resource', async () => {
        const provider = new BscscanProvider(BINANCE_NETWORK, '1234')

        expect(provider.isCommunityResource()).toBeFalsy()
      })
    })
  })

  describe('BinancePocketProvider', () => {
    describe('getUrl', () => {
      it('should return a bsc network url', async () => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK)

        expect(provider.connection.url).toEqual(
          'https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d',
        )
      })

      it('should return a bsc testnet network url', async () => {
        const provider = new BinancePocketProvider(BINANCE_TESTNET_NETWORK)

        expect(provider.connection.url).toEqual(
          'https://bsc-testnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d',
        )
      })

      it('should throw an error if the network is not valid', async () => {
        expect(() => new BinancePocketProvider(1)).toThrow()
      })

      it('should use an applicationSecretKey', async () => {
        const provider = new BinancePocketProvider(BINANCE_TESTNET_NETWORK, {
          applicationId: '1234',
          applicationSecretKey: '4321',
        })

        expect(provider.connection.url).toEqual('https://bsc-testnet.gateway.pokt.network/v1/lb/1234')
        expect(provider.connection.user).toEqual('')
        expect(provider.connection.password).toEqual('4321')
      })
    })

    describe('isCommunityResource', () => {
      it('should return a bsc community resource', async () => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK)

        expect(provider.isCommunityResource()).toBeTruthy()
      })

      it('should return a not bsc community resource', async () => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK, '1234')

        expect(provider.isCommunityResource()).toBeFalsy()
      })
    })
  })

  describe('MoralisProvider', () => {
    describe('getApiKey', () => {
      it('should return the provider options for a string key', async () => {
        expect(MoralisProvider.getApiKey('1234')).toMatchObject({ apiKey: '1234', region: 'nyc' })
      })

      it('should return the provider options for a non string key', async () => {
        expect(MoralisProvider.getApiKey({ apiKey: '1234', region: 'caba' })).toMatchObject({
          apiKey: '1234',
          region: 'caba',
        })
      })

      it('should throw an error if the api key is not valid', async () => {
        expect(() => MoralisProvider.getApiKey('')).toThrow()
      })
    })
    describe('getConnectionInfo', () => {
      it('should return the connection info', async () => {
        expect(MoralisProvider.getConnectionInfo({ apiKey: '1234', region: 'caba' }, 'test')).toMatchObject({
          url: 'https://speedy-nodes-caba.moralis.io/1234/test',
          headers: {},
        })
      })
    })
  })

  describe('BinanceMoralisProvider', () => {
    describe('getUrl', () => {
      it('should return a bsc network url', async () => {
        const provider = new BinanceMoralisProvider(BINANCE_NETWORK, { apiKey: '1234' })

        expect(provider.connection.url).toEqual('https://speedy-nodes-nyc.moralis.io/1234/bsc/mainnet')
      })

      it('should return a bsc testnet network url', async () => {
        const provider = new BinanceMoralisProvider(BINANCE_TESTNET_NETWORK, { apiKey: '1234' })

        expect(provider.connection.url).toEqual('https://speedy-nodes-nyc.moralis.io/1234/bsc/testnet')
      })

      it('should throw an error if the network is not valid', async () => {
        expect(() => new BinanceMoralisProvider(1, { apiKey: '1234' })).toThrow()
      })
    })
  })

  describe('EthereumMoralisProvider', () => {
    describe('getUrl', () => {
      it('should return a mainnet network url', async () => {
        const provider = new EthereumMoralisProvider(MAINNET_NETWORK, { apiKey: '1234' })

        expect(provider.connection.url).toEqual('https://speedy-nodes-nyc.moralis.io/1234/eth/mainnet')
      })

      it('should return a goerli network url', async () => {
        const provider = new EthereumMoralisProvider(GOERLI_NETWORK, { apiKey: '1234' })

        expect(provider.connection.url).toEqual('https://speedy-nodes-nyc.moralis.io/1234/eth/goerli')
      })

      it('should return a sepolia network url', async () => {
        const provider = new EthereumMoralisProvider(SEPOLIA_NETWORK, { apiKey: '1234' })

        expect(provider.connection.url).toEqual('https://speedy-nodes-nyc.moralis.io/1234/eth/sepolia')
      })

      it('should throw an error if the network is not valid', async () => {
        expect(() => new EthereumMoralisProvider(97, { apiKey: '1234' })).toThrow()
      })
    })
  })

  describe('getFallbackProvider', () => {
    it('should throw an error if the providers are empty', async () => {
      expect(() => getFallbackProvider()).rejects.toThrow()
    })

    it('should return a instance of CloudflareProvider', async () => {
      const provider = await getFallbackProvider([new CloudflareProvider(MAINNET_NETWORK)])

      expect(provider).toBeInstanceOf(CloudflareProvider)
    })

    it('should return a instance of FallbackProvider', async () => {
      const provider = await getFallbackProvider([
        new CloudflareProvider(MAINNET_NETWORK),
        new InfuraProvider(MAINNET_NETWORK),
      ])

      expect(provider).toBeInstanceOf(FallbackProvider)
    })
  })

  describe('getMulticallProvider', () => {
    it('should return a instance of MulticallProvider', async () => {
      const fallbackProvider = await getFallbackProvider([
        new CloudflareProvider(MAINNET_NETWORK),
        new InfuraProvider(MAINNET_NETWORK),
      ])

      const provider = await getMulticallProvider(fallbackProvider)

      expect(provider).toBeInstanceOf(multicall.MulticallProvider)
    })
  })

  describe('getBinanceDefaultProvider', () => {
    it('should return a instance of FallbackProvider with BscscanProvider and BinancePocketProvider', async () => {
      const provider = await getBinanceDefaultProvider(BINANCE_TESTNET_NETWORK)

      expect(provider).toBeInstanceOf(FallbackProvider)
      expect((provider as FallbackProvider).providerConfigs[0].provider).toBeInstanceOf(BscscanProvider)
      expect((provider as FallbackProvider).providerConfigs[1].provider).toBeInstanceOf(BinancePocketProvider)
      expect((provider as FallbackProvider).quorum).toEqual(2)
    })

    it('should return a instance of FallbackProvider with BinanceMoralisProvider', async () => {
      const provider = await getBinanceDefaultProvider(BINANCE_TESTNET_NETWORK, { moralis: { apiKey: '1234' } })

      expect(provider).toBeInstanceOf(FallbackProvider)
      expect((provider as FallbackProvider).providerConfigs[0].provider).toBeInstanceOf(BscscanProvider)
      expect((provider as FallbackProvider).providerConfigs[1].provider).toBeInstanceOf(BinancePocketProvider)
      expect((provider as FallbackProvider).providerConfigs[2].provider).toBeInstanceOf(BinanceMoralisProvider)
      expect((provider as FallbackProvider).quorum).toEqual(2)
    })
  })

  describe('getNetworkDefaultProvider', () => {
    it('should return a instance of FallbackProvider with BscscanProvider and BinancePocketProvider', async () => {
      const provider = await getNetworkDefaultProvider(BINANCE_TESTNET_NETWORK)

      expect(provider).toBeInstanceOf(FallbackProvider)
      expect((provider as FallbackProvider).providerConfigs[0].provider).toBeInstanceOf(BscscanProvider)
      expect((provider as FallbackProvider).providerConfigs[1].provider).toBeInstanceOf(BinancePocketProvider)
      expect((provider as FallbackProvider).quorum).toEqual(2)
    })

    it('should return a instance of FallbackProvider with BscscanProvider and BinancePocketProvider', async () => {
      const provider = await getNetworkDefaultProvider(GOERLI_NETWORK)

      expect(provider).toBeInstanceOf(FallbackProvider)
      expect((provider as FallbackProvider).providerConfigs[0].provider).toBeInstanceOf(InfuraProvider)
      expect((provider as FallbackProvider).providerConfigs[1].provider).toBeInstanceOf(EtherscanProvider)
      expect((provider as FallbackProvider).providerConfigs[2].provider).toBeInstanceOf(AlchemyProvider)
      expect((provider as FallbackProvider).providerConfigs[3].provider).toBeInstanceOf(AnkrProvider)
      expect((provider as FallbackProvider).quorum).toEqual(1)
    })
  })
})
