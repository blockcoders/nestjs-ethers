import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { Contract, AbstractProvider, Network, FallbackProvider } from 'ethers'
import * as nock from 'nock'
import t from 'tap'
import * as ABI from './utils/ABI.json'
import { appRequest } from './utils/appRequest'
import {
  ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY,
  ETHERS_ADDRESS,
  GOERLI_ETHERSCAN_API_KEY,
  GOERLI_ETHERSCAN_URL,
  PROVIDER_GET_BLOCK_NUMBER_RESPONSE,
} from './utils/constants'
import { platforms } from './utils/platforms'
import {
  EthersModule,
  InjectEthersProvider,
  InjectContractProvider,
  InjectSignerProvider,
  EthersContract,
  EthersSigner,
  GOERLI_NETWORK,
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
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Injectable()
          class TestService {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: FallbackProvider,
            ) {}
            async someMethod(): Promise<Network> {
              const data = await this.ethersProvider.getNetwork()

              return data
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const network = await this.service.someMethod()

              return { name: network.name, chainId: Number(network.chainId) }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
            providers: [TestService],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body, ['name', 'chainId'])
          t.equal(res.body.name, GOERLI_NETWORK.name)
          t.equal(res.body.chainId, Number(GOERLI_NETWORK.chainId))
          t.end()
        })

        t.test('should inject ethers provider in a controller successfully', async (t) => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network = await this.ethersProvider.getNetwork()

              return { name: network.name, chainId: Number(network.chainId) }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const res = await appRequest(t, TestModule, PlatformAdapter)

          t.equal(res.statusCode, 200)
          t.notHas(res.body, 'network')
          t.hasOwnProps(res.body, ['name', 'chainId'])
          t.equal(res.body.name, GOERLI_NETWORK.name)
          t.equal(res.body.chainId, Number(GOERLI_NETWORK.chainId))
          t.end()
        })

        t.test('should inject contract provider in a service successfully', async (t) => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            async someMethod(): Promise<string> {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return contract.getAddress()
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
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
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

        t.test('should inject contract provider in a controller successfully', async (t) => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            @Get()
            async get() {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)
              const address = await contract.getAddress()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
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

        t.test('should inject signer provider in a service successfully', async (t) => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

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
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
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

        t.test('should inject signer provider in a controller successfully', async (t) => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

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
              EthersModule.forRoot({
                network: GOERLI_NETWORK,
                etherscan: GOERLI_ETHERSCAN_API_KEY,
                useDefaultProvider: false,
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

      t.test('forRootAsync', (t) => {
        t.test('should inject ethers provider in a service successfully', async () => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Injectable()
          class TestService {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: FallbackProvider,
            ) {}
            async someMethod(): Promise<Network> {
              const data = await this.ethersProvider.getNetwork()

              return data
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const network = await this.service.someMethod()

              return { name: network.name, chainId: Number(network.chainId) }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
                    useDefaultProvider: false,
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
          t.hasOwnProps(res.body, ['name', 'chainId'])
          t.equal(res.body.name, GOERLI_NETWORK.name)
          t.equal(res.body.chainId, Number(GOERLI_NETWORK.chainId))
          t.end()
        })

        t.test('should inject ethers provider in a controller successfully', async () => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: AbstractProvider,
            ) {}
            @Get()
            async get() {
              const network = await this.ethersProvider.getNetwork()

              return { name: network.name, chainId: Number(network.chainId) }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
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
          t.hasOwnProps(res.body, ['name', 'chainId'])
          t.equal(res.body.name, GOERLI_NETWORK.name)
          t.equal(res.body.chainId, Number(GOERLI_NETWORK.chainId))
          t.end()
        })

        t.test('should inject contract provider in a service successfully', async () => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            async someMethod(): Promise<string> {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

              return contract.getAddress()
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
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
                    useDefaultProvider: false,
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
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

          @Controller('/')
          class TestController {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
            ) {}
            @Get()
            async get() {
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)
              const address = await contract.getAddress()

              return { address: address.toLowerCase() }
            }
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                useFactory: () => {
                  return {
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
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
          t.same(res.body, { address: ETHERS_ADDRESS })
          t.end()
        })

        t.test('should inject signer provider in a service successfully', async () => {
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

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
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
                    useDefaultProvider: false,
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
          nock(GOERLI_ETHERSCAN_URL)
            .get('')
            .query(ETHERSCAN_GET_BLOCK_NUMBER_QUERY_COMMUNITY)
            .reply(200, PROVIDER_GET_BLOCK_NUMBER_RESPONSE)

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
                    network: GOERLI_NETWORK,
                    etherscan: GOERLI_ETHERSCAN_API_KEY,
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
