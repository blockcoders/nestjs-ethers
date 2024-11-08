import { Module, Controller, Get, Injectable } from '@nestjs/common'
import * as nock from 'nock'
import t from 'tap'
import { EthersModule, EthersSigner, InjectSignerProvider } from '../src'
import { appRequest } from './utils/appRequest'
import {
  ETHERS_ADDRESS,
  ETHERS_PRIVATE_KEY,
  ETHERS_MNEMONIC,
  ETHERS_JSON_WALLET_PASSWORD,
  ETHERS_JSON_WALLET,
} from './utils/constants'
import { platforms } from './utils/platforms'

t.test('EthersSigner', (t) => {
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
        t.test('should create a wallet from a private ket with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWallet(ETHERS_PRIVATE_KEY)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a random wallet With a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createRandomWallet()

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

              return wallet.getAddress()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address }
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
          t.notHas(res.body, 'address')
          t.end()
        })

        t.test('should create a wallet from an encrypted JSON with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = await this.signer.createWalletFromEncryptedJson(
                ETHERS_JSON_WALLET,
                ETHERS_JSON_WALLET_PASSWORD,
              )

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a wallet from a mnemonic with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWalletfromMnemonic(ETHERS_MNEMONIC)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a void signer from an address with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.end()
      })

      t.test('forRootAsync', (t) => {
        t.test('should create a wallet from a private ket with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWallet(ETHERS_PRIVATE_KEY)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a random wallet With a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createRandomWallet()

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

              return wallet.getAddress()
            }
          }

          @Controller('/')
          class TestController {
            constructor(private readonly service: TestService) {}
            @Get()
            async get() {
              const address = await this.service.someMethod()

              return { address }
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
          t.notHas(res.body, 'address')
          t.end()
        })

        t.test('should create a wallet from an encrypted JSON with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = await this.signer.createWalletFromEncryptedJson(
                ETHERS_JSON_WALLET,
                ETHERS_JSON_WALLET_PASSWORD,
              )

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a wallet from a mnemonic with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createWalletfromMnemonic(ETHERS_MNEMONIC)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.test('should create a void signer from an address with a provider injected', async (t) => {
          @Injectable()
          class TestService {
            constructor(
              @InjectSignerProvider()
              private readonly signer: EthersSigner,
            ) {}
            async someMethod(): Promise<string> {
              const wallet = this.signer.createVoidSigner(ETHERS_ADDRESS)

              if (!wallet?.provider?.getNetwork()) {
                throw new Error('No provider injected')
              }

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

        t.end()
      })

      t.end()
    })
  }

  t.end()
})
