import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { EthersModule } from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';

describe('Ethers Module Initialization', () => {
  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      describe('forRoot', () => {
        it('should compile without options', async () => {
          @Module({
            imports: [EthersModule.forRoot()],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
          );
          await app.init();
          await extraWait(PlatformAdapter, app);
        });
      });
    });
  }
});
