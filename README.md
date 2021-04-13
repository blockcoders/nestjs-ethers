NestJS-Ethers
=============

[![npm](https://img.shields.io/npm/v/nestjs-ethers)](https://www.npmjs.com/package/nestjs-ethers)
[![travis](https://api.travis-ci.com/jarcodallo/nestjs-ethers.svg?branch=main)](https://travis-ci.com/github/jarcodallo/nestjs-ethers)
[![coverage](https://coveralls.io/repos/github/jarcodallo/nestjs-ethers/badge.svg?branch=main)](https://coveralls.io/github/jarcodallo/nestjs-ethers?branch=main)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/nestjs-ethers)](https://snyk.io/test/github/jarcodallo/nestjs-ethers)
[![dependencies](https://img.shields.io/david/jarcodallo/nestjs-ethers)](https://img.shields.io/david/jarcodallo/nestjs-ethers)
[![dependabot](https://badgen.net/dependabot/jarcodallo/nestjs-ethers/?icon=dependabot)](https://badgen.net/dependabot/jarcodallo/nestjs-ethers/?icon=dependabot)
[![supported platforms](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)


Ethereum wallet implementation and utilities for NestJS based on [Ethers.js](https://github.com/ethers-io/ethers.js/)

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
   * Optional parameter to name the module context,
   */
  providerName?: string;

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
   * Optional parameter for Cloudflare API Token
   * @see {@link https://cloudflare-eth.com}
   */
  cloudflare?: string;

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
   * Optional parameter the number of backends that must agree
   * (default: 2 for mainnet, 1 for testnets)
   */
  quorum?: number;

  /**
   * Optional parameter if this option is false, EthersModule will try to connect
   * with the credentials provided in options. If you define more than one provider,
   * EthersModule will use the FallbackProvider to send multiple requests simultaneously.
   */
  useDefaultProvider?: boolean;
}
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Jose Ramirez [Twitter](https://twitter.com/jarcodallo)**

## License

Licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.
