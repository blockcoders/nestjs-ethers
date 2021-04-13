import { randomBytes } from 'crypto';

export const RINKEBY_ALCHEMY_BASE_URL = 'https://eth-rinkeby.alchemyapi.io/v2';
export const RINKEBY_ALCHEMY_POKT_URL =
  'https://eth-rinkeby.gateway.pokt.network/v1';
export const RINKEBY_ETHERSCAN_URL = 'https://api-rinkeby.etherscan.io/api';
export const RINKEBY_INFURA_URL = 'https://rinkeby.infura.io/v3';
export const CLOUDFLARE_URL = 'https://cloudflare-eth.com';
export const RINKEBY_ETHERSCAN_API_KEY = randomBytes(17).toString('hex');
export const RINKEBY_ALCHEMY_API_KEY = randomBytes(16).toString('hex');
export const RINKEBY_POKT_API_KEY = randomBytes(12).toString('hex');
export const RINKEBY_POKT_SECRET_KEY = randomBytes(16).toString('hex');
export const RINKEBY_INFURA_PROJECT_ID = randomBytes(16).toString('hex');
export const RINKEBY_INFURA_PROJECT_SECRET = randomBytes(16).toString('hex');
export const PROVIDER_GET_GAS_PRICE_BODY = {
  method: 'eth_gasPrice',
  params: [],
  id: 42,
  jsonrpc: '2.0',
};
export const PROVIDER_GET_GAS_PRICE_RESPONSE = {
  jsonrpc: '2.0',
  id: 42,
  result: '0x3b9aca00',
};
export const ETHERSCAN_GET_GAS_PRICE_QUERY = {
  module: 'proxy',
  action: 'eth_gasPrice',
  apikey: RINKEBY_ETHERSCAN_API_KEY,
};
export const ETHERSCAN_GET_BLOCK_NUMBER_QUERY = {
  module: 'proxy',
  action: 'eth_blockNumber',
  apikey: RINKEBY_ETHERSCAN_API_KEY,
};
export const PROVIDER_GET_BLOCK_NUMBER_BODY = {
  method: 'eth_blockNumber',
  params: [],
  id: 42,
  jsonrpc: '2.0',
};
export const PROVIDER_GET_BLOCK_NUMBER_RESPONSE = {
  jsonrpc: '2.0',
  id: 42,
  result: '0x802f1c',
};
