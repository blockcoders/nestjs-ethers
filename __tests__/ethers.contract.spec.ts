import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import { EthersModule, EthersContract, SmartContract, EthersSigner } from '../src'
import * as ABI from './utils/ABI.json'
import { ETHERS_ADDRESS, ETHERS_PRIVATE_KEY } from './utils/constants'
import { extraWait } from './utils/extraWait'
import { platforms } from './utils/platforms'

describe('EthersSigner', () => {
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
      it('should create an instance of the SmartContract attached to an address with a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersContract: EthersContract) {}
          async someMethod(): Promise<string> {
            const contract: SmartContract = this.ethersContract.create(ETHERS_ADDRESS, ABI)

            if (!contract?.provider?.getNetwork()) {
              throw new Error('No provider injected')
            }

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

        const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
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

      it('should be able to set a Wallet into a SmartContract', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersContract: EthersContract, private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createWallet(ETHERS_PRIVATE_KEY)
            const contract: SmartContract = this.ethersContract.create(ETHERS_ADDRESS, ABI, wallet)

            if (!contract?.provider?.getNetwork()) {
              throw new Error('No provider injected')
            }

            if (!contract?.signer.provider?.getNetwork()) {
              throw new Error('No signer injected')
            }

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

        const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
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
  }
})
