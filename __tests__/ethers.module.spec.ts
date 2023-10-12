// import { randomBytes } from 'crypto';
import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@ethersproject/networks'
import {
  BaseProvider,
  FallbackProvider,
  StaticJsonRpcProvider,
  PocketProvider,
  AlchemyProvider,
} from '@ethersproject/providers'
import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import {
  EthersModule,
  InjectEthersProvider,
  MAINNET_NETWORK,
  GOERLI_NETWORK,
  BscscanProvider,
  BINANCE_TESTNET_NETWORK,
  MUMBAI_NETWORK,
  BSCSCAN_DEFAULT_API_KEY,
  BINANCE_POCKET_DEFAULT_APP_ID,
  BINANCE_NETWORK,
} from '../src'
import {
  GOERLI_ALCHEMY_URL,
  GOERLI_ALCHEMY_API_KEY,
  GOERLI_POCKET_URL,
  GOERLI_POKT_API_KEY,
  GOERLI_POKT_SECRET_KEY,
  GOERLI_ETHERSCAN_URL,
  GOERLI_ETHERSCAN_API_KEY,
  GOERLI_INFURA_URL,
  CLOUDFLARE_URL,
  GOERLI_INFURA_PROJECT_ID,
  GOERLI_INFURA_PROJECT_SECRET,
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
  NEST_APP_OPTIONS,
  TESTNET_BSCPOCKET_URL,
  BSC_POCKET_URL,
  GOERLI_MORALIS_URL,
  GOERLI_MORALIS_API_KEY,
  BINANCE_TESTNET_MORALIS_URL,
  BINANCE_TESTNET_MORALIS_API_KEY,
  GOERLI_ANKR_URL,
  GOERLI_ANKR_API_KEY,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_ALCHEMY_URL)
            .post(`/${GOERLI_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
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
                network: GOERLI_NETWORK,
                alchemy: GOERLI_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_POCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
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
                network: GOERLI_NETWORK,
                pocket: {
                  applicationId: GOERLI_POKT_API_KEY,
                  applicationSecretKey: GOERLI_POKT_SECRET_KEY,
                },
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should work with ethereum moralis provider', async () => {
          nock(GOERLI_MORALIS_URL).post('', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

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
                network: GOERLI_NETWORK,
                moralis: GOERLI_MORALIS_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should work with bsc moralis provider', async () => {
          nock(BINANCE_TESTNET_MORALIS_URL)
            .post('', PROVIDER_GET_GAS_PRICE_BODY)
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
                network: BINANCE_TESTNET_NETWORK,
                moralis: BINANCE_TESTNET_MORALIS_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should work with ankr provider', async () => {
          nock(GOERLI_ANKR_URL).post('', PROVIDER_GET_GAS_PRICE_BODY).reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

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
                network: GOERLI_NETWORK,
                ankr: GOERLI_ANKR_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should work with binance pocket provider', async () => {
          nock(BSC_POCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
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
                network: BINANCE_NETWORK,
                pocket: {
                  applicationId: GOERLI_POKT_API_KEY,
                  applicationSecretKey: GOERLI_POKT_SECRET_KEY,
                },
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should disable ethers logger', async () => {
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
            imports: [EthersModule.forRoot({ disableEthersLogger: true })],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
                bscscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should use the default binance providers without community token', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(TESTNET_BSCPOCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, { ...PROVIDER_GET_GAS_PRICE_BODY, id: 43 })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_BLOCK_NUMBER_BODY)
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
                bscscan: GOERLI_ETHERSCAN_API_KEY,
                pocket: GOERLI_POKT_API_KEY,
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

        it('should use the default binance providers', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query({
              ...ETHERSCAN_GET_GAS_PRICE_QUERY,
              apikey: BSCSCAN_DEFAULT_API_KEY,
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query({
              ...ETHERSCAN_GET_BLOCK_NUMBER_QUERY,
              apikey: BSCSCAN_DEFAULT_API_KEY,
            })
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(TESTNET_BSCPOCKET_URL)
            .post(`/${BINANCE_POCKET_DEFAULT_APP_ID}`, { ...PROVIDER_GET_GAS_PRICE_BODY, id: 43 })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post(`/${BINANCE_POCKET_DEFAULT_APP_ID}`, PROVIDER_GET_BLOCK_NUMBER_BODY)
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
                network: GOERLI_NETWORK,
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
                network: BINANCE_TESTNET_NETWORK,
                custom: CUSTOM_BSC_1_URL,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
                network: BINANCE_TESTNET_NETWORK,
                custom: [CUSTOM_BSC_1_URL, CUSTOM_BSC_2_URL, CUSTOM_BSC_3_URL],
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_POCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(MUMBAI_ALCHEMY_URL)
            .post(`/${GOERLI_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
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
                network: GOERLI_NETWORK,
                pocket: {
                  applicationId: GOERLI_POKT_API_KEY,
                  applicationSecretKey: GOERLI_POKT_SECRET_KEY,
                },
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
          nock(GOERLI_ETHERSCAN_URL)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_INFURA_URL)
            .post(`/${GOERLI_INFURA_PROJECT_ID}`, PROVIDER_GET_GAS_PRICE_BODY)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_INFURA_URL)
            .post(`/${GOERLI_INFURA_PROJECT_ID}`, {
              ...PROVIDER_GET_GAS_PRICE_BODY,
              id: 43,
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post(`/${GOERLI_INFURA_PROJECT_ID}`, PROVIDER_GET_BLOCK_NUMBER_BODY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(GOERLI_ETHERSCAN_URL)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

        it('should use the default binance providers without community token', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          nock(TESTNET_BSCPOCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, { ...PROVIDER_GET_GAS_PRICE_BODY, id: 43 })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_BLOCK_NUMBER_BODY)
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

        it('should use the default binance providers', async () => {
          nock(TESTNET_BSCSCAN_URL)
            .get('')
            .query({
              ...ETHERSCAN_GET_GAS_PRICE_QUERY,
              apikey: BSCSCAN_DEFAULT_API_KEY,
            })
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)
            .get('')
            .query({
              ...ETHERSCAN_GET_BLOCK_NUMBER_QUERY,
              apikey: BSCSCAN_DEFAULT_API_KEY,
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), NEST_APP_OPTIONS)
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
          nock(GOERLI_POCKET_URL)
            .post(`/${GOERLI_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE)

          nock(MUMBAI_ALCHEMY_URL)
            .post(`/${GOERLI_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
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
            public readonly applicationId = GOERLI_POKT_API_KEY
            public readonly applicationSecretKey = GOERLI_POKT_SECRET_KEY
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
