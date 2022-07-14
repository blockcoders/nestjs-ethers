import { Contract } from '@ethersproject/contracts'
import { Network } from '@ethersproject/networks'
import { BaseProvider } from '@ethersproject/providers'
import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import {
  EthersModule,
  InjectEthersProvider,
  InjectContractProvider,
  InjectSignerProvider,
  MAINNET_NETWORK,
  EthersContract,
  EthersSigner,
} from '../src'
import * as ABI from './utils/ABI.json'
import { ETHERS_ADDRESS, NEST_APP_OPTIONS } from './utils/constants'
import { extraWait } from './utils/extraWait'
import { platforms } from './utils/platforms'

describe('InjectEthersProvider', () => {
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
        it('should inject ethers provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            async someMethod(): Promise<Network> {
              return this.ethersProvider.getNetwork()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const network = await this.service.someMethod()

              return { network }
            }
          }

          @Module({
            imports: [EthersModule.forRoot()],
            controllers: [TestController],
            providers: [TestService],
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

        it('should inject ethers provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network = await this.ethersProvider.getNetwork()

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

        it('should inject contract provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            async someMethod(): Promise<string> {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return contract.address
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [EthersModule.forRoot()],
            controllers: [TestController],
            providers: [TestService],
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject contract provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            @Get()
            async get() {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return { address: contract.address.toLowerCase() }
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject signer provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              return wallet.getAddress()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [EthersModule.forRoot()],
            controllers: [TestController],
            providers: [TestService],
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject signer provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            @Get()
            async get() {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              return { address: wallet.address.toLowerCase() }
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })
      })

      describe('forRootAsync', () => {
        it('should inject ethers provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            async someMethod(): Promise<Network> {
              return this.ethersProvider.getNetwork()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const network = await this.service.someMethod()

              return { network }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
                  }
                },
              }),
            ],
            controllers: [TestController],
            providers: [TestService],
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

        it('should inject ethers provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: BaseProvider,
            ) {}
            @Get()
            async get() {
              const network = await this.ethersProvider.getNetwork()

              return { network }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
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

        it('should inject contract provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            async someMethod(): Promise<string> {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return contract.address
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
                  }
                },
              }),
            ],
            controllers: [TestController],
            providers: [TestService],
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject contract provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            @Get()
            async get() {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return { address: contract.address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject signer provider in a service successfully', async () => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              return wallet.getAddress()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
                  }
                },
              }),
            ],
            controllers: [TestController],
            providers: [TestService],
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })

        it('should inject signer provider in a controller successfully', async () => {
          @Controller('/')
          class TestController {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            @Get()
            async get() {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              return { address: wallet.address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    useDefaultProvider: true,
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
              expect(res.body).toHaveProperty('address', ETHERS_ADDRESS)
            })

          await app.close()
        })
      })
    })
  }
})
