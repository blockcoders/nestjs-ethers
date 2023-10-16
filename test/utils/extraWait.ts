import { INestApplication } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Adapter } from './platforms'

export async function extraWait(adapter: Adapter, app: INestApplication) {
  if (adapter === FastifyAdapter) {
    const instance = app.getHttpAdapter().getInstance()
    if (instance && typeof instance.ready === 'function') {
      await instance.ready()
    }
  }
}
