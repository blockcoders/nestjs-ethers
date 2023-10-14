import { NestFactory } from '@nestjs/core'
import * as request from 'supertest'
import { Test } from 'tap'
import { NEST_APP_OPTIONS } from './constants'
import { extraWait } from './extraWait'
import { Adapter } from './platforms'

export async function appRequest(t: Test, module: any, httpAdapter: Adapter): Promise<request.Response> {
  const adapterInstance = new httpAdapter()
  const app = await NestFactory.create(module, adapterInstance, NEST_APP_OPTIONS)

  t.teardown(async () => {
    await app.close()
  })

  const server = app.getHttpServer()

  await app.init()

  await extraWait(httpAdapter, app)

  return request(server).get('/')
}
