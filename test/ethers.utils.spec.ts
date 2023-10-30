import t from 'tap'
import {
  BINANCE_NETWORK,
  BINANCE_TESTNET_NETWORK,
  DECORATED_PREFIX,
  DEFAULT_TOKEN,
  MAINNET_NETWORK,
  SEPOLIA_NETWORK,
  UNSPECIFIED_NETWORK,
} from '../src/ethers.constants'
import { getContractToken, getEthersToken, getNetwork, getSignerToken, isBinanceNetwork } from '../src/ethers.utils'

t.test('getEthersToken', (t) => {
  t.test('should return a default ethers token', (t) => {
    t.equal(getEthersToken(), `${DECORATED_PREFIX}:Provider:${DEFAULT_TOKEN}`)
    t.end()
  })

  t.test('should return a custom ethers token', (t) => {
    t.equal(getEthersToken('custom'), `${DECORATED_PREFIX}:Provider:custom`)
    t.end()
  })

  t.end()
})

t.test('getContractToken', (t) => {
  t.test('should return a default contract token', (t) => {
    t.equal(getContractToken(), `${DECORATED_PREFIX}:Contract:${DEFAULT_TOKEN}`)
    t.end()
  })

  t.test('should return a custom contract token', (t) => {
    t.equal(getContractToken('custom'), `${DECORATED_PREFIX}:Contract:custom`)
    t.end()
  })

  t.end()
})

t.test('getSignerToken', (t) => {
  t.test('should return a default signer token', (t) => {
    t.equal(getSignerToken(), `${DECORATED_PREFIX}:Signer:${DEFAULT_TOKEN}`)
    t.end()
  })

  t.test('should return a custom signer token', (t) => {
    t.equal(getSignerToken('custom'), `${DECORATED_PREFIX}:Signer:custom`)
    t.end()
  })

  t.end()
})

t.test('getNetwork', (t) => {
  t.test('should return a valid network', (t) => {
    const network = getNetwork(1)

    t.equal(network, MAINNET_NETWORK)
    t.end()
  })

  t.test('should return a UNSPECIFIED_NETWORK network', (t) => {
    const network = getNetwork(-1)

    t.equal(network, UNSPECIFIED_NETWORK)
    t.end()
  })

  t.test('should throw an error if the network is not defined', (t) => {
    t.throws(() => getNetwork())
    t.end()
  })

  t.test('should return a valid network for a chainId', (t) => {
    const network = getNetwork(11155111)

    t.equal(network, SEPOLIA_NETWORK)
    t.end()
  })

  t.test('should return a valid network for a name', (t) => {
    const network = getNetwork('sepolia')
    t.equal(network.name, SEPOLIA_NETWORK.name)
    t.end()
  })

  t.test('should return a valid network for a Network object', (t) => {
    const network = getNetwork(SEPOLIA_NETWORK)

    t.equal(network.name, SEPOLIA_NETWORK.name)
    t.end()
  })

  t.end()
})

t.test('isBinanceNetwork', (t) => {
  t.test('should return true for BINANCE_NETWORK', (t) => {
    t.equal(isBinanceNetwork(BINANCE_NETWORK), true)
    t.end()
  })

  t.test('should return true for BINANCE_TESTNET_NETWORK', (t) => {
    t.equal(isBinanceNetwork(BINANCE_TESTNET_NETWORK), true)
    t.end()
  })

  t.test('should return false for non binance networks', async (t) => {
    t.equal(isBinanceNetwork(MAINNET_NETWORK), false)
    t.end()
  })

  t.end()
})
