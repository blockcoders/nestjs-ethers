import { Contract } from '@ethersproject/contracts'
import { Network } from '@ethersproject/networks'
import { BaseProvider } from '@ethersproject/providers'
import { Module, Controller, Get, Injectable } from '@nestjs/common'
import * as nock from 'nock'
import t from 'tap'
import * as ABI from './utils/ABI.json'
import { appRequest } from './utils/appRequest'
import { ETHERS_ADDRESS } from './utils/constants'
import { platforms } from './utils/platforms'
import {
  EthersModule,
  InjectEthersProvider,
  InjectContractProvider,
  InjectSignerProvider,
  MAINNET_NETWORK,
  EthersContract,
  EthersSigner,
} from '../src'

t.test('InjectEthersProvider', (t) => {
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
        t.test('should inject ethers provider in a service successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId', 'ensAddress'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, 1)
          t.end()
        })

        t.test('should inject ethers provider in a controller successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId', 'ensAddress'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, 1)
          t.end()
        })

        t.test('should inject contract provider in a service successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject contract provider in a controller successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject signer provider in a service successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject signer provider in a controller successfully', async (t) => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.end()
      })

      t.test('forRootAsync', (t) => {
        t.test('should inject ethers provider in a service successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId', 'ensAddress'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, 1)
          t.end()
        })

        t.test('should inject ethers provider in a controller successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body.network, ['name', 'chainId', 'ensAddress'])
          t.equal(res.body.network.name, MAINNET_NETWORK.name)
          t.equal(res.body.network.chainId, 1)
          t.end()
        })

        t.test('should inject contract provider in a service successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject contract provider in a controller successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject signer provider in a service successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject signer provider in a controller successfully', async () => {
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

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.end()
      })

      t.end()
    })
  }

  t.end()
})
