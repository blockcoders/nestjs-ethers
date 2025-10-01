import * as nock from 'nock'
import { Body, ReplyBody, ReplyFnContext } from 'nock'
import { ETHERSCAN_V2_URL } from './constants'

export const GAS_STATION_RESPONSE = {
  safeLow: {
    maxPriorityFee: 25,
    maxFee: 25.000000069,
  },
  standard: {
    maxPriorityFee: 25,
    maxFee: 25.000000069,
  },
  fast: {
    maxPriorityFee: 25,
    maxFee: 25.000000069,
  },
  estimatedBaseFee: 6.9e-8,
  blockTime: 2.5,
  blockNumber: 76294707,
}
export function generateMethodQuery(
  method: string,
  chainid: string,
  otherParams?: Record<string, any>,
  apikey?: string,
): Record<string, any> {
  const query: Record<string, any> = {
    module: 'proxy',
    action: method,
    chainid: chainid,
    ...otherParams,
  }

  if (apikey) {
    query['apikey'] = apikey
  }
  return query
}
type RpcResponse = { jsonrpc: string; id?: number; result: any }
export const RPC_RESPONSES: Record<string, RpcResponse> = {
  eth_chainId: { jsonrpc: '2.0', result: '0x61' },
  eth_blockNumber: { jsonrpc: '2.0', result: '0x802f1c' },
  eth_getBlockByNumber: {
    jsonrpc: '2.0',
    id: 1,
    result: {
      baseFeePerGas: '0x989680',
      difficulty: '0x1',
      extraData: '0xc34336c52abd0d966f6edd330215fc30f1bdda37141f62c09392fd47b87094c3',
      gasLimit: '0x4000000000000',
      gasUsed: '0x3d1f9b',
      hash: '0xf79744d03488d866c9088cc7c9ed2cec03189fdda2eb723faae2863b6c0067b0',
      l1BlockNumber: '0x1640ae3',
      logsBloom: '0x00000001',
      miner: '0xa4b000000000000000000073657175656e636572',
      mixHash: '0x0000000000024f4d0000000001640ae300000000000000280000000000000000',
      nonce: '0x0000000000204044',
      number: '0x16839455',
      parentHash: '0x8f751e9d4f93fb93c60f8ebbc04ea1d592efff2b87e43d318b60fea806880c9f',
      receiptsRoot: '0x34bc4d09388576979c78376d2bc736a714b294eb9935e460cb098d7ecd2b30bd',
      sendCount: '0x24f4d',
      sendRoot: '0xc34336c52abd0d966f6edd330215fc30f1bdda37141f62c09392fd47b87094c3',
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      size: '0x17f3',
      stateRoot: '0x0b0fe88a4155f1b4e2dfbd7fda0e066b80daad471fa69bcd2a6fdc2ba0cb9b6d',
      timestamp: '0x68c19ab9',
      transactions: [
        '0xbb234fd1f66abe20e4b7ef01ddcd6ceb9ceb323fe9e2a5921d63f34398f1013f',
        '0xc93317b2598996d35899185bcea386eb841b189da78a8e1617965002cd0a0fcb',
      ],
      transactionsRoot: '0x2f974cb01f1219fd702e8cfd1b275c4e0fb7e60ebab07a0d57e6cbe358d76628',
      uncles: [],
    },
  },
  eth_maxPriorityFeePerGas: {
    jsonrpc: '2.0',
    result: '0x5f5e100',
  },
  eth_gasPrice: {
    jsonrpc: '2.0',
    result: '0x3b9aca00',
  },
}

export function matchResponses(this: ReplyFnContext, uri: string, requestBody: Body): ReplyBody | Promise<ReplyBody> {
  const body = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody

  // Handle single request
  if (!Array.isArray(body)) {
    return {
      ...RPC_RESPONSES[body.method],
      id: body.id, // ensure request id matches
    }
  }

  // Handle batch request
  return body.map((req: any) => ({
    ...RPC_RESPONSES[req.method],
    id: req.id,
  }))
}
export function nockAllRPCRequests() {
  nock('http://www.whatever-here.com', {
    filteringScope: function (scope) {
      const isPostRequestEndpoint = !scope.includes('127.0.0.1') && !scope.includes(ETHERSCAN_V2_URL)
      return isPostRequestEndpoint
    },
  })
    .persist()
    .post(/.*/)
    .reply(200, matchResponses)
  nock(ETHERSCAN_V2_URL)
    .persist()
    .get('/v2/api')
    .query((query) => query.action === 'eth_blockNumber')
    .reply(200, RPC_RESPONSES['eth_blockNumber'])
  nock(ETHERSCAN_V2_URL)
    .persist()
    .get('/v2/api')
    .query((query) => query.action === 'eth_getBlockByNumber')
    .reply(200, RPC_RESPONSES['eth_getBlockByNumber'])
  nock(ETHERSCAN_V2_URL)
    .persist()
    .get('/v2/api')
    .query((query) => query.action === 'eth_gasPrice')
    .reply(200, RPC_RESPONSES['eth_gasPrice'])
  nock(ETHERSCAN_V2_URL)
    .persist()
    .get('/v2/api')
    .query((query) => query.action === 'eth_chainId')
    .reply(200, RPC_RESPONSES['eth_chainId'])
  nock(ETHERSCAN_V2_URL)
    .persist()
    .get('/v2/api')
    .query((query) => query.action === 'eth_maxPriorityFeePerGas')
    .reply(200, RPC_RESPONSES['eth_maxPriorityFeePerGas'])
}
