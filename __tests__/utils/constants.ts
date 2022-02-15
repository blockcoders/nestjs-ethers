import { randomBytes } from 'crypto'

export const RINKEBY_ALCHEMY_URL = 'https://eth-rinkeby.alchemyapi.io/v2'
export const RINKEBY_POCKET_URL = 'https://eth-rinkeby.gateway.pokt.network/v1'
export const RINKEBY_ETHERSCAN_URL = 'https://api-rinkeby.etherscan.io/api'
export const RINKEBY_INFURA_URL = 'https://rinkeby.infura.io/v3'
export const CLOUDFLARE_URL = 'https://cloudflare-eth.com'
export const TESTNET_BSCSCAN_URL = 'https://api-testnet.bscscan.com/api'
export const CUSTOM_BSC_1_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545'
export const CUSTOM_BSC_2_URL = 'https://data-seed-prebsc-1-s3.binance.org:8545'
export const CUSTOM_BSC_3_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545'
export const MUMBAI_ALCHEMY_URL = 'https://polygon-mumbai.g.alchemy.com/v2/'
export const RINKEBY_ETHERSCAN_API_KEY = randomBytes(17).toString('hex')
export const RINKEBY_ALCHEMY_API_KEY = randomBytes(16).toString('hex')
export const RINKEBY_POKT_API_KEY = randomBytes(12).toString('hex')
export const RINKEBY_POKT_SECRET_KEY = randomBytes(16).toString('hex')
export const RINKEBY_INFURA_PROJECT_ID = randomBytes(16).toString('hex')
export const RINKEBY_INFURA_PROJECT_SECRET = randomBytes(16).toString('hex')
export const PROVIDER_GET_GAS_PRICE_BODY = {
  method: 'eth_gasPrice',
  params: [],
  id: 42,
  jsonrpc: '2.0',
}
export const PROVIDER_GET_GAS_PRICE_RESPONSE = {
  jsonrpc: '2.0',
  id: 42,
  result: '0x3b9aca00',
}
export const ETHERSCAN_GET_GAS_PRICE_QUERY = {
  module: 'proxy',
  action: 'eth_gasPrice',
  apikey: RINKEBY_ETHERSCAN_API_KEY,
}
export const ETHERSCAN_GET_BLOCK_NUMBER_QUERY = {
  module: 'proxy',
  action: 'eth_blockNumber',
  apikey: RINKEBY_ETHERSCAN_API_KEY,
}
export const PROVIDER_GET_BLOCK_NUMBER_BODY = {
  method: 'eth_blockNumber',
  params: [],
  id: 42,
  jsonrpc: '2.0',
}
export const PROVIDER_GET_BLOCK_NUMBER_RESPONSE = {
  jsonrpc: '2.0',
  id: 42,
  result: '0x802f1c',
}
export const ETHERS_ADDRESS = '0x012363d61bdc53d0290a0f25e9c89f8257550fb8'
export const ETHERS_PRIVATE_KEY = '0x4c94faa2c558a998d10ee8b2b9b8eb1fbcb8a6ac5fd085c6f95535604fc1bffb'
export const ETHERS_MNEMONIC = 'service basket parent alcohol fault similar survey twelve hockey cloud walk panel'
export const ETHERS_JSON_WALLET_PASSWORD = 'password'
export const ETHERS_JSON_WALLET = JSON.stringify({
  address: '012363d61bdc53d0290a0f25e9c89f8257550fb8',
  id: '5ba8719b-faf9-49ec-8bca-21522e3d56dc',
  version: 3,
  Crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: { iv: 'bc0473d60284d2d6994bb6793e916d06' },
    ciphertext: 'e73ed0b0c53bcaea4516a15faba3f6d76dbe71b9b46a460ed7e04a68e0867dd7',
    kdf: 'scrypt',
    kdfparams: {
      salt: '97f0b6e17c392f76a726ceea02bac98f17265f1aa5cf8f9ad1c2b56025bc4714',
      n: 131072,
      dklen: 32,
      p: 1,
      r: 8,
    },
    mac: 'ff4f2db7e7588f8dd41374d7b98dfd7746b554c0099a6c0765be7b1c7913e1f3',
  },
  'x-ethers': {
    client: 'ethers.js',
    gethFilename: 'UTC--2018-01-27T01-52-22.0Z--012363d61bdc53d0290a0f25e9c89f8257550fb8',
    mnemonicCounter: '70224accc00e35328a010a19fef51121',
    mnemonicCiphertext: 'cf835e13e4f90b190052263dbd24b020',
    version: '0.1',
  },
})
