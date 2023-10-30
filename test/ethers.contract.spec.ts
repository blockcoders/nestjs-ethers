import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { Contract } from 'ethers'
import * as nock from 'nock'
import t from 'tap'
import * as ABI from './utils/ABI.json'
import { appRequest } from './utils/appRequest'
import { ETHERS_ADDRESS, ETHERS_PRIVATE_KEY } from './utils/constants'
import { platforms } from './utils/platforms'
import { EthersModule, EthersContract, EthersSigner, InjectContractProvider, InjectSignerProvider } from '../src'

t.test('EthersContract', (t) => {
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
        t.test(
          'should create an instance of the SmartContract attached to an address with a provider injected',
          async (t) => {
            @Injectable()
            class TestService {
              constructor(
                @InjectContractProvider()
                private readonly contract: EthersContract,
              ) {}
              async someMethod(): Promise<string> {
                const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

                if (!contract?.runner) {
                  throw new Error('No provider injected')
                }

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
              imports: [EthersModule.forRoot()],
              controllers: [TestController],
              providers: [TestService],
            })
            class TestModule {}

            const res = await appRequest(t, TestModule, PlatformAdapter)

            t.equal(res.statusCode, 200)
            t.same(res.body, { address: ETHERS_ADDRESS })
            t.end()
          },
        )

        t.test('should be able to set a Wallet into a SmartContract', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWallet(ETHERS_PRIVATE_KEY)
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI, wallet)

              if (!contract?.runner) {
                throw new Error('No provider injected')
              }

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

        t.end()
      })

      t.test('forRootAsync', (t) => {
        t.test(
          'should create an instance of the SmartContract attached to an address with a provider injected',
          async (t) => {
            @Injectable()
            class TestService {
              constructor(
                @InjectContractProvider()
                private readonly contract: EthersContract,
              ) {}
              async someMethod(): Promise<string> {
                const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI)

                if (!contract?.runner) {
                  throw new Error('No provider injected')
                }

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
          },
        )

        t.test('should be able to set a Wallet into a SmartContract', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectContractProvider()
              private readonly contract: EthersContract,
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWallet(ETHERS_PRIVATE_KEY)
              const contract: Contract = this.contract.create(ETHERS_ADDRESS, ABI, wallet)

              if (!contract?.runner) {
                throw new Error('No provider injected')
              }

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

        t.end()
      })

      t.end()
    })
  }

  t.end()
})
