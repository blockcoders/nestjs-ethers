NestJS-Ethers
=============

[![npm](https://img.shields.io/npm/v/nestjs-ethers)](https://www.npmjs.com/package/nestjs-ethers)
[![CircleCI](https://circleci.com/gh/jarcodallo/nestjs-ethers/tree/main.svg?style=svg)](https://circleci.com/gh/jarcodallo/nestjs-ethers/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/jarcodallo/nestjs-ethers/badge.svg?branch=main)](https://coveralls.io/github/jarcodallo/nestjs-ethers?branch=main)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/nestjs-ethers)](https://snyk.io/test/github/jarcodallo/nestjs-ethers)
[![supported platforms](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)


Ethereum utilities for NestJS based on [Ethers.js](https://github.com/ethers-io/ethers.js/)

## Install

```sh
npm i nestjs-ethers
```

## Register module

### Zero configuration

Just import `EthersModule` to your module:

```ts
import { EthersModule } from 'nestjs-ethers';

@Module({
  imports: [EthersModule.forRoot()],
  ...
})
class MyModule {}
```

**NOTE:** *By default `EthersModule` will try to connect using [getDefaultProvider](https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider). It's the safest, easiest way to begin developing on Ethereum. It creates a [FallbackProvider](https://docs.ethers.io/v5/api/providers/other/#FallbackProvider) connected to as many backend services as possible.* 

### Configuration params

`nestjs-ethers` can be configured with this options:

```ts
interface EthersModuleOptions {
  /**
   * Optional parameter for connection, can be a Network object
   * or the name of a common network as a string (e.g. "homestead")
   * If no network is provided, homestead (i.e. mainnet) is used.
   * The network may also be a URL to connect to,
   * such as http://localhost:8545 or wss://example.com.
   * @see {@link https://docs.ethers.io/v5/api/providers/types/#providers-Networkish}
   */
  network?: Network | string;

  /**
   * Optional parameter for Alchemy API Token
   * @see {@link https://alchemyapi.io}
   */
  alchemy?: string;

  /**
   * Optional parameter for Etherscan API Token
   * @see {@link https://etherscan.io}
   */
  etherscan?: string;

  /**
   * Optional parameter for use Cloudflare Provider
   * @see {@link https://cloudflare-eth.com}
   */
  cloudflare?: boolean;

  /**
   * Optional parameter for Infura Project ID
   * or InfuraProviderOptions(applicationId, applicationSecretKey)
   * @see {@link https://infura.io}
   */
  infura?: InfuraProviderOptions | string;

  /**
   * Optional parameter for Pocket Network Application ID
   * or PocketProviderOptions(projectId, projectSecret)
   * @see {@link https://pokt.network}
   */
  pocket?: PocketProviderOptions | string;
  
  /**
   * Optional parameter for Bscscan API Token
   * @see {@link https://https://bscscan.com/}
   */
  bscscan?: string;
  
  /**
   * Optional parameter for a custom StaticJsonRpcProvider
   * You can connect using an URL, ConnectionInfo or an array of both.
   * @see {@link https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider}
   * @ses {@link https://docs.ethers.io/v5/api/utils/web/#ConnectionInfo}
   */
  custom?: ConnectionInfo | string | (ConnectionInfo | string)[]

  /**
   * Optional parameter the number of backends that must agree
   * (default: 2 for mainnet, 1 for testnets)
   */
  quorum?: number;

  /**
   * Optional parameter if this option is false, EthersModule won't wait until
   * the providers are ready. If this option is true, EthersModule  will wait 
   * until the network has heen established for all the providers.
   * @see {@link https://docs.ethers.io/v5/api/providers/provider/#Provider-ready}
   */
  waitUntilIsConnected?: boolean;

  /**
   * Optional parameter if this option is false, EthersModule will try to connect
   * with the credentials provided in options. If you define more than one provider,
   * EthersModule will use the FallbackProvider to send multiple requests simultaneously.
   */
  useDefaultProvider?: boolean;
  
  /**
   * Optional parameter to associate a token name to EthersProvider,
   * the token is used to request an instance of a class by the same name.
   * This can be useful when you want multiple intances of EthersProvider.
   */
  token?: string;
}
```

### Synchronous configuration

Use `EthersModule.forRoot` method with [Options interface](#configuration-params):

```ts
import { EthersModule, RINKEBY_NETWORK } from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: RINKEBY_NETWORK,
      alchemy: '845ce4ed0120d68eb5740c9160f08f98',
      etherscan: 'e8cce313c1cfbd085f68be509451f1bab8',
      cloudflare: true,
      infura: {
        projectId: 'd71b3d93c2fcfa7cab4924e63298575a',
        projectSecret: 'ed6baa9f7a09877998a24394a12bf3dc',
      },
      pocket: {
        applicationId: '9b0afc55221c429104d04ef9',
        applicationSecretKey: 'b5e6d6a55426712a42a93f39555973fc',
      },
      quorum: 1,
      useDefaultProvider: true,
    })
  ],
  ...
})
class MyModule {}
```

### Asynchronous configuration

With `EthersModule.forRootAsync` you can, for example, import your `ConfigModule` and inject `ConfigService` to use it in `useFactory` method.

`useFactory` should return object with [Options interface](#configuration-params) or undefined

Here's an example:

```ts
import { EthersModule, RINKEBY_NETWORK } from 'nestjs-ethers';

@Injectable()
class ConfigService {
  public readonly infura = {
    projectId: 'd71b3d93c2fcfa7cab4924e63298575a',
    projectSecret: 'ed6baa9f7a09877998a24394a12bf3dc',
  };
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
class ConfigModule {}

@Module({
  imports: [
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        await somePromise();
        return {
          network: RINKEBY_NETWORK,
          infura: config.infura,
          useDefaultProvider: false,
        };
      }
    })
  ],
  ...
})
class TestModule {}
```

Or you can just pass `ConfigService` to `providers`, if you don't have any `ConfigModule`:

```ts
import { EthersModule, RINKEBY_NETWORK } from 'nestjs-ethers';

@Injectable()
class ConfigService {
  public readonly pocket: {
    applicationId: '9b0afc55221c429104d04ef9',
    applicationSecretKey: 'b5e6d6a55426712a42a93f39555973fc',
  };
}

@Module({
  imports: [
    EthersModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          network: RINKEBY_NETWORK,
          pocket: config.pocket,
          useDefaultProvider: false,
        };
      }
    })
  ],
  controllers: [TestController]
})
class TestModule {}
```

You can also pass multiple `ethersjs` configs, if you want to use the `FallbackProvider` to send multiple requests simultaneously:

```ts
import { EthersModule, RINKEBY_NETWORK } from 'nestjs-ethers';

@Injectable()
class ConfigService {
  public readonly infura = {
    projectId: 'd71b3d93c2fcfa7cab4924e63298575a',
    projectSecret: 'ed6baa9f7a09877998a24394a12bf3dc',
  };
  public readonly pocket: {
    applicationId: '9b0afc55221c429104d04ef9',
    applicationSecretKey: 'b5e6d6a55426712a42a93f39555973fc',
  };
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
class ConfigModule {}

@Module({
  imports: [
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        await somePromise();
        return {
          network: RINKEBY_NETWORK,
          infura: config.infura,
          pocket: config.pocket,
          useDefaultProvider: false,
        };
      }
    })
  ],
  ...
})
class TestModule {}
```

## BaseProvider

`BaseProvider` implements standard [Ether.js Provider](https://docs.ethers.io/v5/api/providers/provider/). So if you are familiar with it, you are ready to go.

```ts
import { InjectEthersProvider, BaseProvider } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
  ) {}
  async someMethod(): Promise<Network> {
    return this.ethersProvider.getNetwork();
  }
}
```

## Binance Smart Chain Provider

if you are familiar with [BscscanProvider](https://github.com/ethers-io/ancillary-bsc), you are ready to go.

```ts
import {
  EthersModule,
  InjectEthersProvider,
  BscscanProvider,
  BINANCE_NETWORK
} from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: BINANCE_NETWORK,
      bscscan: '845ce4ed0120d68eb5740c9160f08f98',
      useDefaultProvider: false,
    })
  ],
  ...
})
class MyModule {}

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider()
    private readonly bscProvider: BscscanProvider,
  ) {}
  @Get()
  async get() {
    const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

    return { gasPrice: gasPrice.toString() }
  }
}
```

### Binance Smart Chain Default Provider

This will create a `FallbackProvider`, backed by all popular Third-Party BSC services (currently only [BscscanProvider](https://github.com/ethers-io/ancillary-bsc)).

**NOTE:** if `bscscan` is null or undefined. The BSC default provider will use the [community API Key](https://github.com/ethers-io/ancillary-bsc/blob/main/src.ts/bscscan-provider.ts#L8).

```ts
import {
  EthersModule,
  InjectEthersProvider,
  FallbackProvider,
  BINANCE_NETWORK
} from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: BINANCE_NETWORK,
      useDefaultProvider: true,
    })
  ],
  ...
})
class MyModule {}

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider()
    private readonly bscProvider: FallbackProvider,
  ) {}
  @Get()
  async get() {
    const gasPrice: BigNumber = await this.bscProvider.getGasPrice()

    return { gasPrice: gasPrice.toString() }
  }
}
```

## Custom StaticJsonRpcProvider

if you are familiar with [StaticJsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider), you are ready to go. The custom provider is very helpful when you want to use a RPC that is not defined in [ethers](https://github.com/ethers-io/ethers.js/). This is the case for Binance Smart Chain public [RPCs](https://docs.binance.org/smart-chain/developer/rpc.html).

```ts
import {
  EthersModule,
  InjectEthersProvider,
  StaticJsonRpcProvider,
  BNB_TESTNET_NETWORK
} from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: BNB_TESTNET_NETWORK,
      custom: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      useDefaultProvider: false,
    })
  ],
  ...
})
class MyModule {}

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider()
    private readonly customProvider: StaticJsonRpcProvider,
  ) {}
  @Get()
  async get() {
    const gasPrice: BigNumber = await this.customProvider.getGasPrice()

    return { gasPrice: gasPrice.toString() }
  }
}
```

You can also pass multiple `custom` providers, if you want to use the `FallbackProvider` to send multiple requests simultaneously:

```ts
import {
  EthersModule,
  InjectEthersProvider,
  FallbackProvider,
  BNB_TESTNET_NETWORK
} from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      network: BNB_TESTNET_NETWORK,
      custom: [
        'https://data-seed-prebsc-1-s1.binance.org:8545',
        'https://data-seed-prebsc-1-s3.binance.org:8545',
        'https://data-seed-prebsc-2-s2.binance.org:8545'
      ],
      useDefaultProvider: false,
    })
  ],
  ...
})
class MyModule {}

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider()
    private readonly customProvider: FallbackProvider,
  ) {}
  @Get()
  async get() {
    const gasPrice: BigNumber = await this.customProvider.getGasPrice()

    return { gasPrice: gasPrice.toString() }
  }
}
```

## EthersSigner 

`EthersSigner` implements methods to create a [Wallet](https://docs.ethers.io/v5/api/signer/#Wallet) or [VoidSigner](https://docs.ethers.io/v5/api/signer/#VoidSigner). A `Signer` in ethers is an abstraction of an Ethereum Account, which can be used to sign messages and transactions and send signed transactions to the Ethereum Network. This service will also inject the `BaseProvider` into the wallet.

Create a `Wallet` from a private key:

```ts
import { EthersSigner, Wallet } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(private readonly ethersSigner: EthersSigner) {}
  async someMethod(): Promise<string> {
    const wallet: Wallet = this.ethersSigner.createWallet(
      '0x4c94faa2c558a998d10ee8b2b9b8eb1fbcb8a6ac5fd085c6f95535604fc1bffb'
    );

    return wallet.getAddress();
  }
}
```

Create a random `Wallet`:

```ts
import { EthersSigner, Wallet } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(private readonly ethersSigner: EthersSigner) {}
  async someMethod(): Promise<string> {
    const wallet: Wallet = this.ethersSigner.createRandomWallet();

    return wallet.getAddress();
  }
}
```

Create a `Wallet` from an encrypted JSON:

```ts
import { EthersSigner, Wallet } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(private readonly ethersSigner: EthersSigner) {}
  async someMethod(): Promise<string> {
    const wallet: Wallet = this.ethersSigner.createWalletfromEncryptedJson(
      {
        address: '012363d61bdc53d0290a0f25e9c89f8257550fb8',
        id: '5ba8719b-faf9-49ec-8bca-21522e3d56dc',
        version: 3,
        Crypto: {
          cipher: 'aes-128-ctr',
          cipherparams: { iv: 'bc0473d60284d2d6994bb6793e916d06' },
          ciphertext:
            'e73ed0b0c53bcaea4516a15faba3f6d76dbe71b9b46a460ed7e04a68e0867dd7',
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
      },
      'password'
    );

    return wallet.getAddress();
  }
}
```

Create a `Wallet` from a mnemonic:

```ts
import { EthersSigner, Wallet } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(private readonly ethersSigner: EthersSigner) {}
  async someMethod(): Promise<string> {
    const wallet: Wallet = this.ethersSigner.createWalletfromMnemonic(
      'service basket parent alcohol fault similar survey twelve hockey cloud walk panel'
    );

    return wallet.getAddress();
  }
}
```

Create a `VoidSigner` from an address:

```ts
import { EthersSigner, VoidSigner } from 'nestjs-ethers';

@Injectable()
export class TestService {
  constructor(private readonly ethersSigner: EthersSigner) {}
  async someMethod(): Promise<string> {
    const wallet: VoidSigner = this.ethersSigner.createVoidSigner(
      '0x012363d61bdc53d0290a0f25e9c89f8257550fb8'
    );

    return wallet.getAddress();
  }
}
```

## EthersContract

`EthersContract` implements a method for the creation of a [SmartContract](https://docs.ethers.io/v5/api/contract/) instance. This service will also inject the `BaseProvider` into the contract.

Create a `SmartContract` attached to an address:

```ts
import { EthersContract, SmartContract } from 'nestjs-ethers';
import * as ABI from './utils/ABI.json';

@Injectable()
class TestService {
  constructor(private readonly ethersContract: EthersContract) {}
  async someMethod(): Promise<string> {
    const contract: SmartContract = this.ethersContract.create(
      '0x012363d61bdc53d0290a0f25e9c89f8257550fb8',
      ABI,
    );

    return contract.provider.getNetwork();
  }
}
```

Create a `SmartContract` with a Wallet:

```ts
import { EthersContract, EthersSigner, SmartContract, Wallet } from 'nestjs-ethers';
import * as ABI from './utils/ABI.json';

@Injectable()
class TestService {
  constructor(
    private readonly ethersContract: EthersContract,
    private readonly ethersSigner: EthersSigner,
  ) {}
  async someMethod(): Promise<string> {
    const wallet: Wallet = this.ethersSigner.createWallet(
      '0x4c94faa2c558a998d10ee8b2b9b8eb1fbcb8a6ac5fd085c6f95535604fc1bffb'
    );
    const contract: SmartContract = this.ethersContract.create(
      '0x012363d61bdc53d0290a0f25e9c89f8257550fb8',
      ABI,
      wallet,
    );

    return contract.signer.provider.getNetwork();
  }
}
```

## Multichain mode

You can use the `token` property to use multiple instances of Ethers. This can be helpful when you want to connect with more than an EVN compatible chain like `BSC`, `Polygon` or `Fantom`.

If you know what you're doing, you can enable it like so:

### Synchronous

```ts
import { Module, Controller, Get } from '@nestjs/common'
import {
  EthersModule,
  InjectEthersProvider,
  InjectEthersProvider,
  InjectEthersProvider,
  PocketProvider,
  AlchemyProvider,
  StaticJsonRpcProvider,
  BigNumber,
  RINKEBY_NETWORK,
  MUMBAI_NETWORK,
  BNB_TESTNET_NETWORK,
} from 'nestjs-ethers';

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider('eth')
    private readonly pocketProvider: PocketProvider,
    @InjectEthersProvider('poly')
    private readonly alchemyProvider: AlchemyProvider,
    @InjectEthersProvider('bsc')
    private readonly customProvider: StaticJsonRpcProvider,
  ) {}
  @Get()
  async get() {
    const pocketGasPrice: BigNumber = await this.pocketProvider.getGasPrice()
    const alchemyGasPrice: BigNumber = await this.alchemyProvider.getGasPrice()
    const bscGasPrice: BigNumber = await this.customProvider.getGasPrice()

    return {
      pocketGasPrice: pocketGasPrice.toString(),
      alchemyGasPrice: alchemyGasPrice.toString(),
      bscGasPrice: bscGasPrice.toString(),
    }
  }
}

@Module({
  imports: [
    EthersModule.forRoot({
      token: 'eth',
      network: RINKEBY_NETWORK,
      pocket: {
        applicationId: '9b0afc55221c429104d04ef9',
        applicationSecretKey: 'b5e6d6a55426712a42a93f39555973fc',
      },
      useDefaultProvider: false,
    }),
    EthersModule.forRoot({
      token: 'poly',
      network: MUMBAI_NETWORK,
      alchemy: '845ce4ed0120d68eb5740c9160f08f98',
      useDefaultProvider: false,
    }),
    EthersModule.forRoot({
      token: 'bsc',
      network: BNB_TESTNET_NETWORK,
      custom: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      useDefaultProvider: false,
    }),
  ],
  controllers: [TestController],
})
class TestModule {}
```

### Asynchronous configuration

```ts
import { Module, Controller, Get } from '@nestjs/common'
import {
  EthersModule,
  InjectEthersProvider,
  InjectEthersProvider,
  InjectEthersProvider,
  PocketProvider,
  AlchemyProvider,
  StaticJsonRpcProvider,
  BigNumber,
  RINKEBY_NETWORK,
  MUMBAI_NETWORK,
  BNB_TESTNET_NETWORK,
} from 'nestjs-ethers';

@Controller('/')
class TestController {
  constructor(
    @InjectEthersProvider('eth')
    private readonly pocketProvider: PocketProvider,
    @InjectEthersProvider('poly')
    private readonly alchemyProvider: AlchemyProvider,
    @InjectEthersProvider('bsc')
    private readonly customProvider: StaticJsonRpcProvider,
  ) {}
  @Get()
  async get() {
    const pocketGasPrice: BigNumber = await this.pocketProvider.getGasPrice()
    const alchemyGasPrice: BigNumber = await this.alchemyProvider.getGasPrice()
    const bscGasPrice: BigNumber = await this.customProvider.getGasPrice()

    return {
      pocketGasPrice: pocketGasPrice.toString(),
      alchemyGasPrice: alchemyGasPrice.toString(),
      bscGasPrice: bscGasPrice.toString(),
    }
  }
}

@Injectable()
class ConfigService {
  public readonly applicationId: '9b0afc55221c429104d04ef9'
  public readonly applicationSecretKey: 'b5e6d6a55426712a42a93f39555973fc'
  public readonly alchemy: '845ce4ed0120d68eb5740c9160f08f98'
  public readonly custom: 'https://data-seed-prebsc-1-s1.binance.org:8545'
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      token: 'eth',
      useFactory: (config: ConfigService) => {
        return {
          network: RINKEBY_NETWORK,
          pocket: {
            applicationId: config.applicationId,
            applicationSecretKey: config.applicationSecretKey,
          },
          useDefaultProvider: false,
        }
      },
    }),
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      token: 'poly',
      useFactory: (config: ConfigService) => {
        return {
          network: MUMBAI_NETWORK,
          alchemy: config.alchemy,
          useDefaultProvider: false,
        }
      },
    }),
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      token: 'bsc',
      useFactory: (config: ConfigService) => {
        return {
          network: BNB_TESTNET_NETWORK,
          custom: config.custom,
          useDefaultProvider: false,
        }
      },
    }),
  ],
  controllers: [TestController],
})
class TestModule {}
```

## Testing a class that uses @InjectEthersProvider

This package exposes a getEthersToken(token?: string) function that returns a prepared injection token based on the provided context. 
Using this token, you can easily provide a mock implementation of the `BaseProvider` using any of the standard custom provider techniques, including useClass, useValue, and useFactory.

```ts
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MyService,
      {
        provide: getEthersToken(MyService.name),
        useValue: mockProvider,
      },
    ],
  }).compile();
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Jose Ramirez [Twitter](https://twitter.com/jarcodallo)**

## License

Licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.
