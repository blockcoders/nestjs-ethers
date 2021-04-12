import { defer } from 'rxjs';
import { Provider } from '@nestjs/common';
import {
  BaseProvider,
  getDefaultProvider,
  Network,
} from '@ethersproject/providers';
import { EthersModuleOptions } from './ethers.interface';
import { getEthersToken } from './ethers.utils';
import { ETHERS_MODULE_OPTIONS } from './ethers.constants';

async function createDefaultProvider(
  network: Network | string = 'homestead',
  options: EthersModuleOptions = {},
): Promise<BaseProvider> {
  const provider = getDefaultProvider(network, options);

  // wait until the node is up and running smoothly.
  await provider.ready;

  return provider;
}

export function createEthersProvider(
  network: Network | string = 'homestead',
  options: EthersModuleOptions = {},
): Provider {
  return {
    provide: getEthersToken(options?.providerName ?? ''),
    useFactory: async (): Promise<BaseProvider> => {
      return await defer(() =>
        createDefaultProvider(network, options),
      ).toPromise();
    },
  };
}

export function createcreateEthersAsyncProviders(providerName = ''): Provider {
  return {
    provide: getEthersToken(providerName),
    useFactory: async (options: EthersModuleOptions): Promise<BaseProvider> => {
      return await defer(() =>
        createDefaultProvider(options.network, options),
      ).toPromise();
    },
    inject: [ETHERS_MODULE_OPTIONS],
  };
}
