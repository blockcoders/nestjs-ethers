import { Controller, Get, Injectable, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  AbstractProvider,
  AlchemyProvider,
  EtherscanProvider,
  FallbackProvider,
  FeeData,
  JsonRpcProvider,
  Network,
  PocketProvider,
} from 'ethers'
import * as nock from 'nock'
import t from 'tap'
import { appRequest } from './utils/appRequest'
import {
  BINANCE_TESTNET_MORALIS_API_KEY,
  BINANCE_TESTNET_MORALIS_URL,
  BSC_POCKET_URL,
  CLOUDFLARE_URL,
  CUSTOM_BSC_1_URL,
  CUSTOM_BSC_2_URL,
  CUSTOM_BSC_3_URL,
  ETHERSCAN_V2_URL,
  GOERLI_ALCHEMY_API_KEY,
  GOERLI_ALCHEMY_URL,
  GOERLI_ANKR_API_KEY,
  GOERLI_ANKR_URL,
  GOERLI_ETHERSCAN_API_KEY,
  GOERLI_INFURA_PROJECT_ID,
  GOERLI_INFURA_PROJECT_SECRET,
  GOERLI_INFURA_URL,
  GOERLI_MORALIS_API_KEY,
  GOERLI_MORALIS_URL,
  GOERLI_POCKET_URL,
  GOERLI_POKT_API_KEY,
  MUMBAI_ALCHEMY_URL,
  POLYGON_TESTNET_GASSTATION_URL,
  TESTNET_BSCPOCKET_URL,
} from './utils/constants'
import {
  GAS_STATION_RESPONSE,
  generateMethodQuery,
  matchResponses,
  nockAllRPCRequests,
  RPC_RESPONSES,
} from './utils/mockResponses'
import { platforms } from './utils/platforms'
import {
  BINANCE_NETWORK,
  BINANCE_POCKET_DEFAULT_APP_ID,
  BINANCE_TESTNET_NETWORK,
  BSCSCAN_DEFAULT_API_KEY,
  BscscanProvider,
  EthersModule,
  GOERLI_NETWORK,
  InjectEthersProvider,
  MAINNET_NETWORK,
  MUMBAI_NETWORK,
} from '../src'

t.test('Ethers Module Initialization', (t) => {
  t.beforeEach(() => nock.cleanAll())

  t.before(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  t.after(() => nock.restore())

  for (const PlatformAdapter of platforms) {
    t.test(PlatformAdapter.name, (t) => {
      t.test('forRoot', (t) => {
        t.test('should compile without options', async (t) => {
          nockAllRPCRequests()

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()
              return { network }
            }
          }
          @Module({
            imports: [EthersModule.forRoot()],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, '1')
          t.end()
        })

        t.test('should work with alchemy provider', async (t) => {
          nock(GOERLI_ALCHEMY_URL).persist().post(`/v2/${GOERLI_ALCHEMY_API_KEY}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                alchemy: GOERLI_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with pocket provider', async (t) => {
          nock(GOERLI_POCKET_URL)
            .persist()
            .post(`/${GOERLI_POKT_API_KEY.applicationId}`)
            .basicAuth({ user: '', pass: GOERLI_POKT_API_KEY.applicationSecretKey })
            .reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                pocket: GOERLI_POKT_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with ethereum moralis provider', async (t) => {
          nock(GOERLI_MORALIS_URL).persist().post('').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                moralis: GOERLI_MORALIS_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with bsc moralis provider', async (t) => {
          nock(BINANCE_TESTNET_MORALIS_URL).persist().post('').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                moralis: BINANCE_TESTNET_MORALIS_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with ankr provider', async (t) => {
          nock(GOERLI_ANKR_URL).persist().post('').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                ankr: GOERLI_ANKR_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with binance pocket provider', async (t) => {
          nock(BSC_POCKET_URL)
            .persist()
            .post(`/${GOERLI_POKT_API_KEY.applicationId}`)
            .basicAuth({ user: '', pass: GOERLI_POKT_API_KEY.applicationSecretKey })
            .reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_NETWORK,
                pocket: GOERLI_POKT_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should compile with network option as number', async (t) => {
          nockAllRPCRequests()
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Module({
            imports: [EthersModule.forRoot({ network: 1 })],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, '1')
          t.end()
        })

        t.test('should compile with network option as string', async (t) => {
          nockAllRPCRequests()
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Module({
            imports: [EthersModule.forRoot({ network: 'mainnet' })],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, '1')
          t.end()
        })

        t.test('should throw an error when network is invalid', async (t) => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Module({
            imports: [EthersModule.forRoot({ network: 'sarasa', useDefaultProvider: false })],
            controllers: [TestController],
          })
          class TestModule {}

          t.rejects(() => NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }))
          t.end()
        })

        t.test(
          'should throw an error when useDefaultProvider is false and no explicit provider is provided',
          async (t) => {
            @Controller('/')
            class TestController {
              constructor(
                @InjectEthersProvider()
                private readonly ethersProvider: AbstractProvider,
              ) {}
              @Get()
              async get() {
                const network: Network = await this.ethersProvider.getNetwork()

                return { network }
              }
            }

            @Module({
              imports: [EthersModule.forRoot({ useDefaultProvider: false })],
              controllers: [TestController],
            })
            class TestModule {}

            t.rejects(() =>
              NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
            )
            t.end()
          },
        )

        t.test('should work with bscscan provider', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: EtherscanProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()
              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                bscscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should use the default binance providers without community token', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          nock(TESTNET_BSCPOCKET_URL).persist().post(`/${GOERLI_POKT_API_KEY.applicationId}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                bscscan: GOERLI_ETHERSCAN_API_KEY,
                pocket: GOERLI_POKT_API_KEY,
                useDefaultProvider: true,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should use the default binance providers', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          nock(TESTNET_BSCPOCKET_URL).persist().post(`/${BINANCE_POCKET_DEFAULT_APP_ID}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                useDefaultProvider: true,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should throw an error if the network is different to Mainnet with Cloudflare', async (t) => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                cloudflare: true,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          t.rejects(() => NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }))
          t.end()
        })

        t.test('should work with one custom provider', async (t) => {
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: JsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.customProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                custom: CUSTOM_BSC_1_URL,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with more than one custom provider', async (t) => {
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)
          nock(CUSTOM_BSC_2_URL).persist().post('/').reply(200, matchResponses)
          nock(CUSTOM_BSC_3_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.customProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                custom: [CUSTOM_BSC_1_URL, CUSTOM_BSC_2_URL, CUSTOM_BSC_3_URL],
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with multiple instances of ethers provider', async (t) => {
          nock(GOERLI_POCKET_URL).persist().post(`/${GOERLI_POKT_API_KEY.applicationId}`).reply(200, matchResponses)
          nock(POLYGON_TESTNET_GASSTATION_URL).persist().get('/v2').reply(200, GAS_STATION_RESPONSE)
          nock(MUMBAI_ALCHEMY_URL).persist().post(`/${GOERLI_ALCHEMY_API_KEY}`).reply(200, matchResponses)
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider('eth')
              private readonly pocketProvider: PocketProvider,
              @InjectEthersProvider('poly')
              private readonly alchemyProvider: AlchemyProvider,
              @InjectEthersProvider('bsc')
              private readonly customProvider: JsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const pocketGasPrice: FeeData = await this.pocketProvider.getFeeData()
              const alchemyGasPrice: FeeData = await this.alchemyProvider.getFeeData()
              const bscGasPrice: FeeData = await this.customProvider.getFeeData()

              return {
                pocketGasPrice: pocketGasPrice.gasPrice?.toString(),
                alchemyGasPrice: alchemyGasPrice.gasPrice?.toString(),
                bscGasPrice: bscGasPrice.gasPrice?.toString(),
              }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                token: 'eth',
                network: GOERLI_NETWORK,
                pocket: GOERLI_POKT_API_KEY,
                useDefaultProvider: false,
              }),
              EthersModule.forRoot({
                token: 'poly',
                network: MUMBAI_NETWORK,
                alchemy: GOERLI_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
              EthersModule.forRoot({
                token: 'bsc',
                network: BINANCE_TESTNET_NETWORK,
                custom: CUSTOM_BSC_1_URL,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body, ['pocketGasPrice', 'alchemyGasPrice', 'bscGasPrice'])
          t.equal(res.body.pocketGasPrice, '1000000000')
          t.equal(res.body.alchemyGasPrice, '1000000000')
          t.equal(res.body.bscGasPrice, '1000000000')
          t.end()
        })

        t.end()
      })

      t.test('forRootAsync', (t) => {
        t.test('should compile properly with useFactory', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                GOERLI_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                GOERLI_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                GOERLI_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = GOERLI_ETHERSCAN_API_KEY
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: GOERLI_NETWORK,
                    etherscan: config.etherscan,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work properly when pass dependencies via providers', async (t) => {
          nock(GOERLI_INFURA_URL).persist().post(`/${GOERLI_INFURA_PROJECT_ID}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly infura = {
              projectId: GOERLI_INFURA_PROJECT_ID,
              projectSecret: GOERLI_INFURA_PROJECT_SECRET,
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: GOERLI_NETWORK,
                    infura: config.infura,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work properly when useFactory returns Promise', async (t) => {
          nock(CLOUDFLARE_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly cloudflare = true
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (config: ConfigService) => {
                  await new Promise((r) => setTimeout(r, 20))

                  return {
                    cloudflare: config.cloudflare,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work properly when useFactory uses more than one Provider', async (t) => {
          nock(GOERLI_INFURA_URL).persist().post(`/${GOERLI_INFURA_PROJECT_ID}`).reply(200, matchResponses)

          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                GOERLI_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                GOERLI_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                GOERLI_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.ethersProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = GOERLI_ETHERSCAN_API_KEY
            public readonly infura = {
              projectId: GOERLI_INFURA_PROJECT_ID,
              projectSecret: GOERLI_INFURA_PROJECT_SECRET,
            }
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: GOERLI_NETWORK,
                    etherscan: config.etherscan,
                    infura: config.infura,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should compile with network option as number', async (t) => {
          nockAllRPCRequests()

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Injectable()
          class ConfigService {
            public readonly network = 1
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: config.network,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, '1')
          t.end()
        })

        t.test('should compile with network option as string', async (t) => {
          nockAllRPCRequests()
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Injectable()
          class ConfigService {
            public readonly network = 'mainnet'
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: config.network,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, '1')
          t.end()
        })

        t.test('should throw an error when network is invalid', async (t) => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly network = 'sarasa'
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: config.network,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          t.rejects(() => NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }))
          t.end()
        })

        t.test('should throw an error when useDefaultProvider is false and the providers are invalid', async (t) => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly useDefaultProvider = false
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    useDefaultProvider: config.useDefaultProvider,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          t.rejects(() => NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }))
          t.end()
        })

        t.test('should work with bscscan provider', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: BscscanProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly bscscan = GOERLI_ETHERSCAN_API_KEY
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    bscscan: config.bscscan,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should use the default binance providers without community token', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                GOERLI_ETHERSCAN_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          nock(TESTNET_BSCPOCKET_URL).persist().post(`/${GOERLI_POKT_API_KEY.applicationId}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly bscscan = GOERLI_ETHERSCAN_API_KEY
            public readonly pocket = GOERLI_POKT_API_KEY
            public readonly useDefaultProvider = true
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    pocket: config.pocket,
                    bscscan: config.bscscan,
                    useDefaultProvider: config.useDefaultProvider,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should use the default binance providers', async (t) => {
          nock(ETHERSCAN_V2_URL)
            .persist()
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_blockNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_blockNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_getBlockByNumber',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                {
                  tag: 'latest',
                  boolean: false,
                },
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
            .get('/v2/api')
            .query(
              generateMethodQuery(
                'eth_gasPrice',
                BINANCE_TESTNET_NETWORK.chainId.toString(),
                undefined,
                BSCSCAN_DEFAULT_API_KEY,
              ),
            )
            .reply(200, RPC_RESPONSES['eth_gasPrice'])

          nock(TESTNET_BSCPOCKET_URL).persist().post(`/${BINANCE_POCKET_DEFAULT_APP_ID}`).reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.bscProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly useDefaultProvider = true
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    useDefaultProvider: config.useDefaultProvider,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should throw an error if the network is different to Mainnet with Cloudflare', async (t) => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly network = GOERLI_NETWORK
            public readonly cloudflare = true
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: config.network,
                    cloudflare: config.cloudflare,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          t.rejects(() => NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }))
          t.end()
        })

        t.test('should work with one custom provider', async (t) => {
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: JsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.customProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly custom = CUSTOM_BSC_1_URL
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with more than one custom provider', async (t) => {
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)
          nock(CUSTOM_BSC_2_URL).persist().post('/').reply(200, matchResponses)
          nock(CUSTOM_BSC_3_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const data: FeeData = await this.customProvider.getFeeData()

              return { gasPrice: data.gasPrice?.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly custom = [CUSTOM_BSC_1_URL, CUSTOM_BSC_2_URL, CUSTOM_BSC_3_URL]
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}
          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { gasPrice: '1000000000' })
          t.end()
        })

        t.test('should work with multiple instances of ethers provider', async (t) => {
          nock(GOERLI_POCKET_URL).persist().post(`/${GOERLI_POKT_API_KEY.applicationId}`).reply(200, matchResponses)
          nock(POLYGON_TESTNET_GASSTATION_URL).persist().get('/v2').reply(200, GAS_STATION_RESPONSE)
          nock(MUMBAI_ALCHEMY_URL).persist().post(`/${GOERLI_ALCHEMY_API_KEY}`).reply(200, matchResponses)
          nock(CUSTOM_BSC_1_URL).persist().post('/').reply(200, matchResponses)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider('eth')
              private readonly pocketProvider: PocketProvider,
              @InjectEthersProvider('poly')
              private readonly alchemyProvider: AlchemyProvider,
              @InjectEthersProvider('bsc')
              private readonly customProvider: JsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const pocketGasPrice: FeeData = await this.pocketProvider.getFeeData()
              const alchemyGasPrice: FeeData = await this.alchemyProvider.getFeeData()
              const bscGasPrice: FeeData = await this.customProvider.getFeeData()

              return {
                pocketGasPrice: pocketGasPrice.gasPrice?.toString(),
                alchemyGasPrice: alchemyGasPrice.gasPrice?.toString(),
                bscGasPrice: bscGasPrice.gasPrice?.toString(),
              }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly applicationId = GOERLI_POKT_API_KEY.applicationId
            public readonly applicationSecretKey = GOERLI_POKT_API_KEY.applicationSecretKey
            public readonly alchemy = GOERLI_ALCHEMY_API_KEY
            public readonly custom = CUSTOM_BSC_1_URL
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}

          @Module({
            imports: [
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                token: 'eth',
                useFactory: (config: ConfigService) => {
                  return {
                    network: GOERLI_NETWORK,
                    pocket: {
                      applicationId: config.applicationId,
                      applicationSecretKey: config.applicationSecretKey,
                    },
                    useDefaultProvider: false,
                  }
                },
              }),
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                token: 'poly',
                useFactory: (config: ConfigService) => {
                  return {
                    network: MUMBAI_NETWORK,
                    alchemy: config.alchemy,
                    useDefaultProvider: false,
                  }
                },
              }),
              EthersModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                token: 'bsc',
                useFactory: (config: ConfigService) => {
                  return {
                    network: BINANCE_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body, ['pocketGasPrice', 'alchemyGasPrice', 'bscGasPrice'])
          t.equal(res.body.pocketGasPrice, '1000000000')
          t.equal(res.body.alchemyGasPrice, '1000000000')
          t.equal(res.body.bscGasPrice, '1000000000')
          t.end()
        })

        t.end()
      })

      t.end()
    })
  }

  t.end()
})
