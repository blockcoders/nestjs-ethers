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

**NOTE:** *By default `EthersModule` will try to connect using [getDefaultProvider](https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider). It's the safest, easiest way to begin developing on Ethereum, and it is also robust enough for use in production. It creates a [FallbackProvider](https://docs.ethers.io/v5/api/providers/other/#FallbackProvider) connected to as many backend services as possible.* 

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Jose Ramirez [Twitter](https://twitter.com/jarcodallo)**

## License

Licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.