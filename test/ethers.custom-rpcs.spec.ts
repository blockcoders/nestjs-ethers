import {
  AlchemyProvider,
  AnkrProvider,
  CloudflareProvider,
  EtherscanProvider,
  FallbackProvider,
  InfuraProvider,
} from '@ethersproject/providers'
import * as nock from 'nock'
import t from 'tap'
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
  getNetworkDefaultProvider,
  MoralisProvider,
} from '../src/ethers.custom-rpcs'

t.test('Ethers Custom RPC', (t) => {
  t.beforeEach(() => nock.cleanAll())

  t.before(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  t.after(() => nock.restore())

  t.test('BscscanProvider', (t) => {
    t.test('getBaseUrl', (t) => {
      t.test('should return a bsc network url', (t) => {
        const provider = new BscscanProvider(BINANCE_NETWORK)

        t.equal(provider.getBaseUrl(), 'https://api.bscscan.com')
        t.end()
      })

      t.test('should return a bsc testnet network url', (t) => {
        const provider = new BscscanProvider(BINANCE_TESTNET_NETWORK)

        t.equal(provider.getBaseUrl(), 'https://api-testnet.bscscan.com')
        t.end()
      })

      t.test('should throw an error if the network is not valid', (t) => {
        t.throws(() => new BscscanProvider(1))
        t.end()
      })

      t.end()
    })

    t.test('isCommunityResource', (t) => {
      t.test('should return a bsc communt.testy resource', (t) => {
        const provider = new BscscanProvider(BINANCE_NETWORK)

        t.ok(provider.isCommunityResource())
        t.end()
      })

      t.test('should return a not bsc communt.testy resource', (t) => {
        const provider = new BscscanProvider(BINANCE_NETWORK, '1234')

        t.notOk(provider.isCommunityResource())
        t.end()
      })

      t.end()
    })

    t.end()
  })

  t.test('BinancePocketProvider', (t) => {
    t.test('getUrl', (t) => {
      t.test('should return a bsc network url', (t) => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK)

        t.equal(provider.connection.url, 'https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d')
        t.end()
      })

      t.test('should return a bsc testnet network url', (t) => {
        const provider = new BinancePocketProvider(BINANCE_TESTNET_NETWORK)

        t.equal(provider.connection.url, 'https://bsc-testnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d')
        t.end()
      })

      t.test('should throw an error if the network is not valid', (t) => {
        t.throws(() => new BinancePocketProvider(1))
        t.end()
      })

      t.test('should use an applicationSecretKey', (t) => {
        const provider = new BinancePocketProvider(BINANCE_TESTNET_NETWORK, {
          applicationId: '1234',
          applicationSecretKey: '4321',
        })

        t.equal(provider.connection.url, 'https://bsc-testnet.gateway.pokt.network/v1/lb/1234')
        t.equal(provider.connection.user, '')
        t.equal(provider.connection.password, '4321')
        t.end()
      })

      t.end()
    })

    t.test('isCommunityResource', (t) => {
      t.test('should return a bsc communt.testy resource', (t) => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK)

        t.ok(provider.isCommunityResource())
        t.end()
      })

      t.test('should return a not bsc communt.testy resource', (t) => {
        const provider = new BinancePocketProvider(BINANCE_NETWORK, '1234')

        t.notOk(provider.isCommunityResource())
        t.end()
      })

      t.end()
    })

    t.end()
  })

  t.test('MoralisProvider', (t) => {
    t.test('getApiKey', (t) => {
      t.test('should return the provider options for a string key', (t) => {
        t.same(MoralisProvider.getApiKey('1234'), { apiKey: '1234', region: 'nyc' })
        t.end()
      })

      t.test('should return the provider options for a non string key', (t) => {
        t.same(MoralisProvider.getApiKey({ apiKey: '1234', region: 'caba' }), {
          apiKey: '1234',
          region: 'caba',
        })
        t.end()
      })

      t.test('should throw an error if the api key is not valid', (t) => {
        t.throws(() => MoralisProvider.getApiKey(''))
        t.end()
      })

      t.end()
    })
    t.test('getConnectionInfo', (t) => {
      t.test('should return the connection info', (t) => {
        t.same(MoralisProvider.getConnectionInfo({ apiKey: '1234', region: 'caba' }, 'test'), {
          url: 'https://speedy-nodes-caba.moralis.io/1234/test',
          headers: {},
        })
        t.end()
      })

      t.end()
    })

    t.end()
  })

  t.test('BinanceMoralisProvider', (t) => {
    t.test('getUrl', (t) => {
      t.test('should return a bsc network url', (t) => {
        const provider = new BinanceMoralisProvider(BINANCE_NETWORK, { apiKey: '1234' })

        t.equal(provider.connection.url, 'https://speedy-nodes-nyc.moralis.io/1234/bsc/mainnet')
        t.end()
      })

      t.test('should return a bsc testnet network url', (t) => {
        const provider = new BinanceMoralisProvider(BINANCE_TESTNET_NETWORK, { apiKey: '1234' })

        t.equal(provider.connection.url, 'https://speedy-nodes-nyc.moralis.io/1234/bsc/testnet')
        t.end()
      })

      t.test('should throw an error if the network is not valid', (t) => {
        t.throws(() => new BinanceMoralisProvider(1, { apiKey: '1234' }))
        t.end()
      })

      t.end()
    })

    t.end()
  })

  t.test('EthereumMoralisProvider', (t) => {
    t.test('getUrl', (t) => {
      t.test('should return a mainnet network url', (t) => {
        const provider = new EthereumMoralisProvider(MAINNET_NETWORK, { apiKey: '1234' })

        t.equal(provider.connection.url, 'https://speedy-nodes-nyc.moralis.io/1234/eth/mainnet')
        t.end()
      })

      t.test('should return a goerli network url', (t) => {
        const provider = new EthereumMoralisProvider(GOERLI_NETWORK, { apiKey: '1234' })

        t.equal(provider.connection.url, 'https://speedy-nodes-nyc.moralis.io/1234/eth/goerli')
        t.end()
      })

      t.test('should return a sepolia network url', (t) => {
        const provider = new EthereumMoralisProvider(SEPOLIA_NETWORK, { apiKey: '1234' })

        t.equal(provider.connection.url, 'https://speedy-nodes-nyc.moralis.io/1234/eth/sepolia')
        t.end()
      })

      t.test('should throw an error if the network is not valid', (t) => {
        t.throws(() => new EthereumMoralisProvider(97, { apiKey: '1234' }))
        t.end()
      })

      t.end()
    })

    t.end()
  })

  t.test('getFallbackProvider', (t) => {
    t.test('should throw an error if the providers are empty', (t) => {
      t.rejects(() => getFallbackProvider())
      t.end()
    })

    t.test('should return a instance of CloudflareProvider', async (t) => {
      const provider = await getFallbackProvider([new CloudflareProvider(MAINNET_NETWORK)])

      t.type(provider, CloudflareProvider)
      t.end()
    })

    t.test('should return a instance of FallbackProvider', async (t) => {
      const provider = await getFallbackProvider([
        new CloudflareProvider(MAINNET_NETWORK),
        new InfuraProvider(MAINNET_NETWORK),
      ])

      t.type(provider, FallbackProvider)
      t.end()
    })

    t.end()
  })

  t.test('getBinanceDefaultProvider', (t) => {
    t.test(
      'should return a instance of FallbackProvider wt.testh BscscanProvider and BinancePocketProvider',
      async (t) => {
        const provider = await getBinanceDefaultProvider(BINANCE_TESTNET_NETWORK)

        t.type(provider, FallbackProvider)
        t.type((provider as FallbackProvider).providerConfigs[0].provider, BscscanProvider)
        t.type((provider as FallbackProvider).providerConfigs[1].provider, BinancePocketProvider)
        t.equal((provider as FallbackProvider).quorum, 2)
        t.end()
      },
    )

    t.test('should return a instance of FallbackProvider wt.testh BinanceMoralisProvider', async (t) => {
      const provider = await getBinanceDefaultProvider(BINANCE_TESTNET_NETWORK, { moralis: { apiKey: '1234' } })

      t.type(provider, FallbackProvider)
      t.type((provider as FallbackProvider).providerConfigs[0].provider, BscscanProvider)
      t.type((provider as FallbackProvider).providerConfigs[1].provider, BinancePocketProvider)
      t.type((provider as FallbackProvider).providerConfigs[2].provider, BinanceMoralisProvider)
      t.equal((provider as FallbackProvider).quorum, 2)
      t.end()
    })

    t.end()
  })

  t.test('getNetworkDefaultProvider', (t) => {
    t.test(
      'should return a instance of FallbackProvider wt.testh BscscanProvider and BinancePocketProvider',
      async (t) => {
        const provider = await getNetworkDefaultProvider(BINANCE_TESTNET_NETWORK)

        t.type(provider, FallbackProvider)
        t.type((provider as FallbackProvider).providerConfigs[0].provider, BscscanProvider)
        t.type((provider as FallbackProvider).providerConfigs[1].provider, BinancePocketProvider)
        t.equal((provider as FallbackProvider).quorum, 2)
        t.end()
      },
    )

    t.test(
      'should return a instance of FallbackProvider wt.testh BscscanProvider and BinancePocketProvider',
      async (t) => {
        const provider = await getNetworkDefaultProvider(GOERLI_NETWORK)

        t.type(provider, FallbackProvider)
        t.type((provider as FallbackProvider).providerConfigs[0].provider, InfuraProvider)
        t.type((provider as FallbackProvider).providerConfigs[1].provider, EtherscanProvider)
        t.type((provider as FallbackProvider).providerConfigs[2].provider, AlchemyProvider)
        t.type((provider as FallbackProvider).providerConfigs[3].provider, AnkrProvider)
        t.equal((provider as FallbackProvider).quorum, 1)
        t.end()
      },
    )

    t.end()
  })

  t.end()
})
