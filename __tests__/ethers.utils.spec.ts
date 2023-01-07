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

describe('Ethers Utils', () => {
  describe('getEthersToken', () => {
    it('should return a default ethers token', async () => {
      expect(getEthersToken()).toEqual(`${DECORATED_PREFIX}:Provider:${DEFAULT_TOKEN}`)
    })

    it('should return a custom ethers token', async () => {
      expect(getEthersToken('custom')).toEqual(`${DECORATED_PREFIX}:Provider:custom`)
    })
  })

  describe('getContractToken', () => {
    it('should return a default contract token', async () => {
      expect(getContractToken()).toEqual(`${DECORATED_PREFIX}:Contract:${DEFAULT_TOKEN}`)
    })

    it('should return a custom contract token', async () => {
      expect(getContractToken('custom')).toEqual(`${DECORATED_PREFIX}:Contract:custom`)
    })
  })

  describe('getSignerToken', () => {
    it('should return a default signer token', async () => {
      expect(getSignerToken()).toEqual(`${DECORATED_PREFIX}:Signer:${DEFAULT_TOKEN}`)
    })

    it('should return a custom signer token', async () => {
      expect(getSignerToken('custom')).toEqual(`${DECORATED_PREFIX}:Signer:custom`)
    })
  })

  describe('getNetwork', () => {
    it('should return a valid network', async () => {
      const network = getNetwork(1)

      expect(network).toEqual(MAINNET_NETWORK)
    })

    it('should return a UNSPECIFIED_NETWORK network', async () => {
      const network = getNetwork(-1)

      expect(network).toEqual(UNSPECIFIED_NETWORK)
    })

    it('should throw an error if the network is not defined', async () => {
      expect(() => getNetwork(null)).toThrow()
    })

    it('should return a valid network for a chainId', async () => {
      const network = getNetwork(11155111)

      expect(network).toEqual(SEPOLIA_NETWORK)
    })

    it('should return a valid network for a name', async () => {
      const network = getNetwork('sepolia')

      expect(network).toEqual(SEPOLIA_NETWORK)
    })

    it('should return a valid network for a Network object', async () => {
      const network = getNetwork(SEPOLIA_NETWORK)

      expect(network).toEqual(SEPOLIA_NETWORK)
    })
  })

  describe('isBinanceNetwork', () => {
    it('should return true for BINANCE_NETWORK', async () => {
      expect(isBinanceNetwork(BINANCE_NETWORK)).toEqual(true)
    })

    it('should return true for BINANCE_TESTNET_NETWORK', async () => {
      expect(isBinanceNetwork(BINANCE_TESTNET_NETWORK)).toEqual(true)
    })

    it('should return false for non binance networks', async () => {
      expect(isBinanceNetwork(MAINNET_NETWORK)).toEqual(false)
    })
  })
})
