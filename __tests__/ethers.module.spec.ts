// import { randomBytes } from 'crypto';
import { BigNumber } from '@ethersproject/bignumber'
import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import {
  EthersModule,
  InjectEthersProvider,
  BaseProvider,
  MAINNET_NETWORK,
  RINKEBY_NETWORK,
  BINANCE_TESTNET_NETWORK,
  Network,
  BscscanProvider,
  FallbackProvider,
  StaticJsonRpcProvider,
  BNB_TESTNET_NETWORK,
  MUMBAI_NETWORK,
  PocketProvider,
  AlchemyProvider,
} from '../src'
import {
  RINKEBY_ALCHEMY_URL,
  RINKEBY_ALCHEMY_API_KEY,
  RINKEBY_POCKET_URL,
  RINKEBY_POKT_API_KEY,
  RINKEBY_POKT_SECRET_KEY,
  RINKEBY_ETHERSCAN_URL,
  RINKEBY_ETHERSCAN_API_KEY,
  RINKEBY_INFURA_URL,
  CLOUDFLARE_URL,
  RINKEBY_INFURA_PROJECT_ID,
  RINKEBY_INFURA_PROJECT_SECRET,
  ETHERSCAN_GET_GAS_PRICE_QUERY,
  PROVIDER_GET_GAS_PRICE_BODY,
  PROVIDER_GET_GAS_PRICE_RESPONSE,
  ETHERSCAN_GET_BLOCK_NUMBER_QUERY,
  PROVIDER_GET_BLOCK_NUMBER_BODY,
  PROVIDER_GET_BLOCK_NUMBER_RESPONSE,
  TESTNET_BSCSCAN_URL,
  CUSTOM_BSC_1_URL,
  CUSTOM_BSC_2_URL,
  CUSTOM_BSC_3_URL,
  MUMBAI_ALCHEMY_URL,
} from './utils/constants'
import { extraWait } from './utils/extraWait'
import { platforms } from './utils/platforms'

describe('Ethers Module Initialization', () => {
  beforeEach(() => nock.cleanAll())

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  afterAll(() => {
    nock.restore()
  })

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      describe('forRoot', () => {
        it('should compile without options', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should work with alchemy provider', async () => {
          nock(RINKEBY_ALCHEMY_URL)
            .post(`/${RINKEBY_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: RINKEBY_NETWORK,
                alchemy: RINKEBY_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work with pocket provider', async () => {
          nock(RINKEBY_POCKET_URL)
            .post(`/${RINKEBY_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                network: RINKEBY_NETWORK,
                pocket: {
                  applicationId: RINKEBY_POKT_API_KEY,
                  applicationSecretKey: RINKEBY_POKT_SECRET_KEY,
                },
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should compile with network option as number', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should compile with network option as string', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Module({
            imports: [EthersModule.forRoot({ network: 'homestead' })],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should throw an error when network is invalid', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Module({
            imports: [EthersModule.forRoot({ network: 'sarasa' })],
            controllers: [TestController],
          })
          class TestModule {}

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should throw an error when useDefaultProvider is false and the providers are invalid', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should not wait until providers are connected', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Module({
            imports: [EthersModule.forRoot({ waitUntilIsConnected: false })],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should work with bscscan provider', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: BscscanProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                bscscan: RINKEBY_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should use the default bsc provider without community token', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BINANCE_TESTNET_NETWORK,
                bscscan: RINKEBY_ETHERSCAN_API_KEY,
                useDefaultProvider: true,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should use the default bsc provider', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query({
              ...ETHERSCAN_GET_GAS_PRICE_QUERY,
              apikey: 'EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9',
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query({
              ...ETHERSCAN_GET_BLOCK_NUMBER_QUERY,
              apikey: 'EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9',
            })
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should throw an error if the network is different to Mainnet with Cloudflare', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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
                network: RINKEBY_NETWORK,
                cloudflare: true,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should work with one custom provider', async () => {
          nock(CUSTOM_BSC_1_URL).post('/', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: StaticJsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.customProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BNB_TESTNET_NETWORK,
                custom: CUSTOM_BSC_1_URL,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work with more than one custom provider', async () => {
          nock(CUSTOM_BSC_1_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(CUSTOM_BSC_2_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(CUSTOM_BSC_3_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.customProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: BNB_TESTNET_NETWORK,
                custom: [CUSTOM_BSC_1_URL, CUSTOM_BSC_2_URL, CUSTOM_BSC_3_URL],
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work with multiple instances of ethers provider', async () => {
          nock(RINKEBY_POCKET_URL)
            .post(`/${RINKEBY_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(MUMBAI_ALCHEMY_URL)
            .post(`/${RINKEBY_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(CUSTOM_BSC_1_URL).post('/', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider('eth')
              private readonly pocketProvider: PocketProvider,
              @InjectEthersProvider('poly')
              private readonly alchemyProvider: AlchemyProvider,
              @InjectEthersProvider('bsc')
              private readonly customProvider: StaticJsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const pocketGasPrice: BigNumber = await this.pocketProvider.getGasPrice()
              const alchemyGasPrice: BigNumber = await this.alchemyProvider.getGasPrice()
              const bscGasPrice: BigNumber = await this.customProvider.getGasPrice()

              return {
                pocketGasPrice: pocketGasPrice.toString(),
                alchemyGasPrice: alchemyGasPrice.toString(),
                bscGasPrice: bscGasPrice.toString(),
              }
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot({
                token: 'eth',
                network: RINKEBY_NETWORK,
                pocket: {
                  applicationId: RINKEBY_POKT_API_KEY,
                  applicationSecretKey: RINKEBY_POKT_SECRET_KEY,
                },
                useDefaultProvider: false,
              }),
              EthersModule.forRoot({
                token: 'poly',
                network: MUMBAI_NETWORK,
                alchemy: RINKEBY_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
              EthersModule.forRoot({
                token: 'bsc',
                network: BNB_TESTNET_NETWORK,
                custom: CUSTOM_BSC_1_URL,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('pocketGasPrice', '1000000000')
              expect(res.body).toHaveProperty('alchemyGasPrice', '1000000000')
              expect(res.body).toHaveProperty('bscGasPrice', '1000000000')
            })

          await app.close()
        })
      })

      describe('forRootAsync', () => {
        it('should compile properly with useFactory', async () => {
          nock(RINKEBY_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = RINKEBY_ETHERSCAN_API_KEY
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
                    network: RINKEBY_NETWORK,
                    etherscan: config.etherscan,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work properly when pass dependencies via providers', async () => {
          nock(RINKEBY_INFURA_URL)
            .post(`/${RINKEBY_INFURA_PROJECT_ID}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly infura = {
              projectId: RINKEBY_INFURA_PROJECT_ID,
              projectSecret: RINKEBY_INFURA_PROJECT_SECRET,
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: RINKEBY_NETWORK,
                    infura: config.infura,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work properly when useFactory returns Promise', async () => {
          nock(CLOUDFLARE_URL).post('/', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work properly when useFactory uses more than one Provider', async () => {
          nock(RINKEBY_INFURA_URL)
            .post(`/${RINKEBY_INFURA_PROJECT_ID}`, {
              ...PROVIDER_GET_GAS_PRICE_BODY,
              id: 43,
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post(`/${RINKEBY_INFURA_PROJECT_ID}`, PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(RINKEBY_ETHERSCAN_URL)
            .get('/')
            .query({
              ...ETHERSCAN_GET_GAS_PRICE_QUERY,
              id: 43,
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('/')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = RINKEBY_ETHERSCAN_API_KEY
            public readonly infura = {
              projectId: RINKEBY_INFURA_PROJECT_ID,
              projectSecret: RINKEBY_INFURA_PROJECT_SECRET,
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
                    network: RINKEBY_NETWORK,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should compile with network option as number', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should compile with network option as string', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Injectable()
          class ConfigService {
            public readonly network = 'homestead'
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should throw an error when network is invalid', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should throw an error when useDefaultProvider is false and the providers are invalid', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
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

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should not wait until providers are connected', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }
          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    waitUntilIsConnected: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body.network).toBeDefined()
              expect(res.body.network).toHaveProperty('name', MAINNET_NETWORK.name)
              expect(res.body.network).toHaveProperty('chainId', 1)
              expect(res.body.network).toHaveProperty('ensAddress')
            })

          await app.close()
        })

        it('should work with bscscan provider', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: BscscanProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly bscscan = RINKEBY_ETHERSCAN_API_KEY
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should use the default bsc provider without community token', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly bscscan = RINKEBY_ETHERSCAN_API_KEY
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
                    bscscan: config.bscscan,
                    useDefaultProvider: config.useDefaultProvider,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should use the default bsc provider', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query({
              ...ETHERSCAN_GET_GAS_PRICE_QUERY,
              apikey: 'EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9',
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query({
              ...ETHERSCAN_GET_BLOCK_NUMBER_QUERY,
              apikey: 'EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9',
            })
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly bscProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should throw an error if the network is different to Mainnet with Cloudflare', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network: Network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly network = RINKEBY_NETWORK
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

          await expect(
            NestFactory.create(TestModule, new PlatformAdapter(), { logger: false, abortOnError: false }),
          ).rejects.toThrow(Error)
        })

        it('should work with one custom provider', async () => {
          nock(CUSTOM_BSC_1_URL).post('/', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: StaticJsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.customProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
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
                    network: BNB_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work with more than one custom provider', async () => {
          nock(CUSTOM_BSC_1_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(CUSTOM_BSC_2_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(CUSTOM_BSC_3_URL)
            .post('/', PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post('/', PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly customProvider: FallbackProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.customProvider.getGasPrice()

              return { gasPrice: gasPrice.toString() }
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
                    network: BNB_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('gasPrice', '1000000000')
            })

          await app.close()
        })

        it('should work with multiple instances of ethers provider', async () => {
          nock(RINKEBY_POCKET_URL)
            .post(`/${RINKEBY_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(MUMBAI_ALCHEMY_URL)
            .post(`/${RINKEBY_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(CUSTOM_BSC_1_URL).post('/', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider('eth')
              private readonly pocketProvider: PocketProvider,
              @InjectEthersProvider('poly')
              private readonly alchemyProvider: AlchemyProvider,
              @InjectEthersProvider('bsc')
              private readonly customProvider: StaticJsonRpcProvider,
            ) {}
            @Get()
            async get() {
              const pocketGasPrice: BigNumber = await this.pocketProvider.getGasPrice()
              const alchemyGasPrice: BigNumber = await this.alchemyProvider.getGasPrice()
              const bscGasPrice: BigNumber = await this.customProvider.getGasPrice()

              return {
                pocketGasPrice: pocketGasPrice.toString(),
                alchemyGasPrice: alchemyGasPrice.toString(),
                bscGasPrice: bscGasPrice.toString(),
              }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly applicationId = RINKEBY_POKT_API_KEY
            public readonly applicationSecretKey = RINKEBY_POKT_SECRET_KEY
            public readonly alchemy = RINKEBY_ALCHEMY_API_KEY
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
                    network: RINKEBY_NETWORK,
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
                    network: BNB_TESTNET_NETWORK,
                    custom: config.custom,
                    useDefaultProvider: false,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), {
            logger: false,
            abortOnError: false,
          })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('pocketGasPrice', '1000000000')
              expect(res.body).toHaveProperty('alchemyGasPrice', '1000000000')
              expect(res.body).toHaveProperty('bscGasPrice', '1000000000')
            })

          await app.close()
        })
      })
    })
  }
})
