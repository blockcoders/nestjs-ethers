import { defer, lastValueFrom } from 'rxjs';
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
  JsonRpcProvider,
} from '@ethersproject/providers';
import { BscscanProvider } from '@ethers-ancillary/bsc';
import {
  EthersModuleOptions,
  EthersModuleAsyncOptions,
  CustomRpcProvider,
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
    bsccsan,
    infura,
    pocket,
    cloudflare = false,
    custom,
    quorum = 1,
    waitUntilIsConnected = true,
    useDefaultProvider = true,
  } = options;

  if (!useDefaultProvider) {
    const providers: Array<BaseProvider> = [];

    if (alchemy) {
      providers.push(new AlchemyProvider(network, alchemy));
    }

    if (etherscan) {
      providers.push(new EtherscanProvider(network, etherscan));
    }

    if (bsccsan) {
      providers.push(new BscscanProvider(network, bsccsan));
    }

    if (infura) {
      providers.push(new InfuraProvider(network, infura));
    }

    if (pocket) {
      providers.push(new PocketProvider(network, pocket));
    }

    if (
      cloudflare &&
      (network === MAINNET_NETWORK || network === MAINNET_NETWORK.name)
    ) {
      providers.push(new CloudflareProvider(network));
    }

    if (custom) {
      const customOptions: CustomRpcProvider[] = !Array.isArray(custom)
        ? [custom]
        : custom;

      custom;

      customOptions.forEach((customOption) => {
        providers.push(
          new JsonRpcProvider(customOption.url, customOption.network),
        );
      });
    }

    if (waitUntilIsConnected) {
      // wait until the node is up and running smoothly.
      await Promise.all(providers.map((provider) => provider.ready));
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
    provide: getEthersToken(options.context),
    useFactory: async (): Promise<BaseProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(options)));
    },
  };
}

export function createEthersAsyncProvider(context?: string): Provider {
  return {
    provide: getEthersToken(context),
    useFactory: async (options: EthersModuleOptions): Promise<BaseProvider> => {
      return await lastValueFrom(defer(() => createBaseProvider(options)));
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

export function createProviderName(context?: string): Provider {
  return {
    provide: ETHERS_PROVIDER_NAME,
    useValue: getEthersToken(context),
  };
}
