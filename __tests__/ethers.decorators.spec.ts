import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import {
  EthersModule,
  InjectEthersProvider,
  EthersBaseProvider,
  Network,
} from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';

describe('InjectEthersProvider', () => {
  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      it('should inject ethers provider in a service successfully', async () => {
        @Injectable()
        class TestService {
          constructor(
            @InjectEthersProvider()
            private readonly ethersProvider: EthersBaseProvider,
          ) {}
          async someMethod(): Promise<Network> {
            return this.ethersProvider.getNetwork();
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            const network = await this.service.someMethod();

            return { network };
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
            expect(res.body.network).toBeDefined();
            expect(res.body.network).toHaveProperty('name', 'homestead');
            expect(res.body.network).toHaveProperty('chainId', 1);
            expect(res.body.network).toHaveProperty('ensAddress');
          });

        await app.close();
      });

      it('should inject ethers provider in a controller successfully', async () => {
        @Controller('/')
        class TestController {
          constructor(
            @InjectEthersProvider()
            private readonly ethersProvider: EthersBaseProvider,
          ) {}
          @Get()
          async get() {
            const network = await this.ethersProvider.getNetwork();

            return { network };
          }
        }

        @Module({
          imports: [EthersModule.forRoot()],
          controllers: [TestController],
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
            expect(res.body.network).toBeDefined();
            expect(res.body.network).toHaveProperty('name', 'homestead');
            expect(res.body.network).toHaveProperty('chainId', 1);
            expect(res.body.network).toHaveProperty('ensAddress');
          });

        await app.close();
      });
    });
  }
});
