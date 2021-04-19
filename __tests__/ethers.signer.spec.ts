import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import { EthersModule, EthersSigner } from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';
import {
  ETHERS_ADDRESS,
  ETHERS_PRIVATE_KEY,
  ETHERS_MNEMONIC,
  ETHERS_JSON_WALLET_PASSWORD,
  ETHERS_JSON_WALLET,
} from './utils/constants';

describe('EthersSigner', () => {
  beforeEach(() => nock.cleanAll());

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate();
    }

    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(() => {
    nock.restore();
  });

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      it('should create a wallet from a private ket with a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createWallet(ETHERS_PRIVATE_KEY);

            if (!wallet?.provider?.getNetwork()) {
              throw new Error('No provider injected');
            }

            return wallet.getAddress();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const address = await this.service.someMethod();

            return { address: address.toLowerCase() };
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
            expect(res.body).toHaveProperty('address', ETHERS_ADDRESS);
          });

        await app.close();
      });

      it('should create a random wallet With a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createRandomWallet();

            if (!wallet?.provider?.getNetwork()) {
              throw new Error('No provider injected');
            }

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

      it('should create a wallet from an encrypted JSON with a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = await this.ethersSigner.createWalletfromEncryptedJson(
              ETHERS_JSON_WALLET,
              ETHERS_JSON_WALLET_PASSWORD,
            );

            if (!wallet?.provider?.getNetwork()) {
              throw new Error('No provider injected');
            }

            return wallet.getAddress();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const address = await this.service.someMethod();

            return { address: address.toLowerCase() };
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
            expect(res.body).toHaveProperty('address', ETHERS_ADDRESS);
          });

        await app.close();
      });

      it('should create a wallet from a mnemonic with a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createWalletfromMnemonic(
              ETHERS_MNEMONIC,
            );

            if (!wallet?.provider?.getNetwork()) {
              throw new Error('No provider injected');
            }

            return wallet.getAddress();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const address = await this.service.someMethod();

            return { address: address.toLowerCase() };
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
            expect(res.body).toHaveProperty('address', ETHERS_ADDRESS);
          });

        await app.close();
      });

      it('should create a void signer from an address with a provider injected', async () => {
        @Injectable()
        class TestService {
          constructor(private readonly ethersSigner: EthersSigner) {}
          async someMethod(): Promise<string> {
            const wallet = this.ethersSigner.createVoidSigner(ETHERS_ADDRESS);

            if (!wallet?.provider?.getNetwork()) {
              throw new Error('No provider injected');
            }

            return wallet.getAddress();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const address = await this.service.someMethod();

            return { address: address.toLowerCase() };
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
            expect(res.body).toHaveProperty('address', ETHERS_ADDRESS);
          });

        await app.close();
      });
    });
  }
});
