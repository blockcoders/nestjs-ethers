import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import { EthersModule, EthersSigner } from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';

describe('EthersSigner', () => {
  beforeEach(() => nock.cleanAll());

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate();
    }

    // nock.recorder.rec();
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(() => {
    // console.log(nock.recorder.play());
    // nock.recorder.clear();
    nock.restore();
  });

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      it('should inject ethers Signer in a service successfully', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createWallet(
              '0x9680527c376c8e39aee03ce04c86cc5390d2392fcb1c74eb9100656e27659bde',
            );

            return wallet.getAddress();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const address = await this.service.someMethod();

            return { address };
          }
        }

        @Module({
          imports: [EthersModule.forRoot()],
          controllers: [TestController],
          providers: [TestService],
        })
        class TestModule {}

        const app = await NestFactory.create(
          TestModule,
          new PlatformAdapter(),
          { logger: false },
        );
        const server = app.getHttpServer();

        await app.init();
        await extraWait(PlatformAdapter, app);
        await request(server)
          .get('/')
          .expect(200)
          .expect((res) => {
            expect(res.body.address).toBeDefined();
          });

        await app.close();
      });
    });
  }
});
