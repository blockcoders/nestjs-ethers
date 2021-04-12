// import { randomBytes } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import { EthersModule, InjectEthersProvider, EthersBaseProvider } from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';
import {
  RINKEBY_ALCHEMY_BASE_URL,
  RINKEBY_ALCHEMY_API_KEY,
  RINKEBY_ALCHEMY_POKT_URL,
  RINKEBY_POKT_API_KEY,
  RINKEBY_POKT_SECRET_KEY,
  RINKEBY_ETHERSCAN_POKT_URL,
  RINKEBY_ETHERSCAN_API_KEY,
  RINKEBY_INFURA_POKT_URL,
  RINKEBY_INFURA_PROJECT_ID,
  RINKEBY_INFURA_PROJECT_SECRET,
  ETHERSCAN_GET_GAS_PRICE_QUERY,
  PROVIDER_GET_GAS_PRICE_BODY,
  PROVIDER_GET_GAS_PRICE_RESPONSE,
} from './utils/constants';
import { BigNumber } from '@ethersproject/bignumber';

describe('Ethers Module Initialization', () => {
  beforeEach(() => nock.cleanAll());

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate();
    }

    // nock.recorder.rec({ dont_print: true });
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
      describe('forRoot', () => {
        it('should compile without options', async () => {
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

        it('should work with alchemy provider', async () => {
          nock(RINKEBY_ALCHEMY_BASE_URL)
            .post(`/${RINKEBY_ALCHEMY_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE);

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: EthersBaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice();

              return { gasPrice: gasPrice.toString() };
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot('rinkeby', {
                alchemy: RINKEBY_ALCHEMY_API_KEY,
                useDefaultProvider: false,
              }),
            ],
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
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty('gasPrice', '1000000000');
            });

          await app.close();
        });

        it('should work with pocket provider', async () => {
          nock(RINKEBY_ALCHEMY_POKT_URL)
            .post(`/${RINKEBY_POKT_API_KEY}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE);

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: EthersBaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice();

              return { gasPrice: gasPrice.toString() };
            }
          }
          @Module({
            imports: [
              EthersModule.forRoot('rinkeby', {
                pocket: {
                  applicationId: RINKEBY_POKT_API_KEY,
                  applicationSecretKey: RINKEBY_POKT_SECRET_KEY,
                },
                useDefaultProvider: false,
              }),
            ],
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
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty('gasPrice', '1000000000');
            });

          await app.close();
        });
      });

      describe('forRootAsync', () => {
        it('should compile properly with useFactory', async () => {
          nock(RINKEBY_ETHERSCAN_POKT_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE);

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: EthersBaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice();

              return { gasPrice: gasPrice.toString() };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = RINKEBY_ETHERSCAN_API_KEY;
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
                    etherscan: config.etherscan,
                    useDefaultProvider: false,
                  };
                },
              }),
            ],
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
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty('gasPrice', '1000000000');
            });

          await app.close();
        });

        it('should work properly when pass deps via providers', async () => {
          nock(RINKEBY_INFURA_POKT_URL)
            .post(`/${RINKEBY_INFURA_PROJECT_ID}`, PROVIDER_GET_GAS_PRICE_BODY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE);

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: EthersBaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice();

              return { gasPrice: gasPrice.toString() };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly infura = {
              projectId: RINKEBY_INFURA_PROJECT_ID,
              projectSecret: RINKEBY_INFURA_PROJECT_SECRET,
            };
          }

          @Module({
            imports: [
              EthersModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    network: 'rinkeby',
                    infura: config.infura,
                    useDefaultProvider: false,
                  };
                },
              }),
            ],
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
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty('gasPrice', '1000000000');
            });

          await app.close();
        });

        it('should work properly when useFactory returns Promise', async () => {
          nock(RINKEBY_ETHERSCAN_POKT_URL)
            .get('')
            .query(ETHERSCAN_GET_GAS_PRICE_QUERY)
            .reply(200, PROVIDER_GET_GAS_PRICE_RESPONSE);

          @Controller('/')
          class TestController {
            constructor(
              @InjectEthersProvider()
              private readonly ethersProvider: EthersBaseProvider,
            ) {}
            @Get()
            async get() {
              const gasPrice: BigNumber = await this.ethersProvider.getGasPrice();

              return { gasPrice: gasPrice.toString() };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly etherscan = RINKEBY_ETHERSCAN_API_KEY;
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
                  await new Promise((r) => setTimeout(r, 20));

                  return {
                    etherscan: config.etherscan,
                    useDefaultProvider: false,
                  };
                },
              }),
            ],
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
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty('gasPrice', '1000000000');
            });

          await app.close();
        });
      });
    });
  }
});
