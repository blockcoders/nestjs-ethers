import { defer } from 'rxjs';
import { Provider } from '@nestjs/common';
import {
  BaseProvider,
  getDefaultProvider,
  FallbackProvider,
  AlchemyProvider,
  CloudflareProvider,
  EtherscanProvider,
  InfuraProvider,
  PocketProvider,
} from '@ethersproject/providers';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
} from './ethers.interface';
import { getEthersToken } from './ethers.utils';
import {
  ETHERS_MODULE_OPTIONS,
  ETHERS_PROVIDER_NAME,
  MAINNET_NETWORK,
} from './ethers.constants';

export async function createBaseProvider(
  options: EthersModuleOptions = {},
): Promise<BaseProvider> {
  const {
    network = MAINNET_NETWORK,
    alchemy,
    etherscan,
    infura,
    pocket,
    cloudflare = false,
    quorum = 1,
    useDefaultProvider = true,
  } = options;

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = [];

    if (alchemy) {
      const alchemyProvider = new AlchemyProvider(network, alchemy);

      // wait until the node is up and running smoothly.
      await alchemyProvider.ready;

      providers.push(alchemyProvider);
    }

    if (etherscan) {
      const etherscanProvider = new EtherscanProvider(network, etherscan);

      // wait until the node is up and running smoothly.
      await etherscanProvider.ready;

      providers.push(etherscanProvider);
    }

    if (infura) {
      const infuraProvider = new InfuraProvider(network, infura);

      // wait until the node is up and running smoothly.
      await infuraProvider.ready;

      providers.push(infuraProvider);
    }

    if (pocket) {
      const pocketProvider = new PocketProvider(network, pocket);

      // wait until the node is up and running smoothly.
      await pocketProvider.ready;

      providers.push(pocketProvider);
    }

    if (
      cloudflare &&
      (network === MAINNET_NETWORK || network === MAINNET_NETWORK.name)
    ) {
      const cloudflareProvider = new CloudflareProvider(network);

      // wait until the node is up and running smoothly.
      await cloudflareProvider.ready;

      providers.push(cloudflareProvider);
    }

    if (providers.length > 1) {
      /**
       * FallbackProvider with selected providers.
       * @see {@link https://docs.ethers.io/v5/api/providers/other/#FallbackProvider}
       */
      return new FallbackProvider(providers, quorum);
    }

    if (providers.length === 1) {
      return providers[0];
    }
  }

  /**
   * The default provider is the safest, easiest way to begin developing on Ethereum
   * It creates a FallbackProvider connected to as many backend services as possible.
   * @see {@link https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider}
   */
  return getDefaultProvider(network, {
    alchemy,
    etherscan,
    infura,
    pocket,
    quorum,
  });
}

export function createEthersProvider(
  options: EthersModuleOptions = {},
): Provider {
  return {
    provide: getEthersToken(),
    useFactory: async (): Promise<BaseProvider> => {
      return await defer(() => createBaseProvider(options)).toPromise();
    },
  };
}

export function createEthersAsyncProvider(): Provider {
  return {
    provide: getEthersToken(),
    useFactory: async (options: EthersModuleOptions): Promise<BaseProvider> => {
      return await defer(() => createBaseProvider(options)).toPromise();
    },
    inject: [ETHERS_MODULE_OPTIONS],
  };
}

export function createAsyncOptionsProvider(
  options: EthersModuleAsyncOptions,
): Provider {
  return {
    provide: ETHERS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject || [],
  };
}

export function createProviderName(): Provider {
  return {
    provide: ETHERS_PROVIDER_NAME,
    useValue: getEthersToken(),
  };
}
