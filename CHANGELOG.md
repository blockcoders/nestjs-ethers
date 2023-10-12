# Changelog

## 2.1.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2023/10/12**
- [#148](https://github.com/blockcoders/nestjs-ethers/pull/148) Added option to use MulticallProvider instead of StaticJsonRpcProvider when using custom provider by [@0x67](https://github.com/0x67)

## 2.0.3
Published by **[blockcoders](https://github.com/blockcoders)** on **2023/01/07**
- Add @ethersproject/* as dependencies

## 2.0.2
Published by **[blockcoders](https://github.com/blockcoders)** on **2023/01/07**
- Update Readme

## 2.0.1
Published by **[blockcoders](https://github.com/blockcoders)** on **2023/01/07**
- [#145](https://github.com/blockcoders/nestjs-ethers/pull/145) Fix @nestjs/common peer dependenciy version

## 2.0.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2023/01/07**
- [#140](https://github.com/blockcoders/nestjs-ethers/pull/140) Release v2.0.0 - Nest.js v9
- [#142](https://github.com/blockcoders/nestjs-ethers/pull/142) Update README.md by [@copocaneta](https://github.com/copocaneta)

### BREAKING CHANGE
- Dropped support for node < 14
- Upgrade @nestjs/* from 8.x to 9.x
- Remove deprecated ethereum chains (ropsten, rinkeby and kovan).
- Add new RPC providers Moralis and Ankr.
- Ethers.js is not longer part of the index.ts export.
- @ethersproject/* is now part of peerDependencies.
- Rename `MATIC_NETWORK` with `POLYGON_NETWORK`.

## 1.0.3
Published by **[blockcoders](https://github.com/blockcoders)** on **2022/05/08**
- [#141](https://github.com/blockcoders/nestjs-ethers/pull/141) Update dependencies
- [#139](https://github.com/blockcoders/nestjs-ethers/pull/139) Fix: Function name createWalletFromEncryptedJson by [@GustavoRSSilva](https://github.com/GustavoRSSilva)
- [#138](https://github.com/blockcoders/nestjs-ethers/pull/138) Fix: README injected variable ethersContract by [@GustavoRSSilva](https://github.com/GustavoRSSilva)

## 1.0.2
Published by **[blockcoders](https://github.com/blockcoders)** on **2022/05/08**
- [#137](https://github.com/blockcoders/nestjs-ethers/pull/137) Update dependencies
- [#135](https://github.com/blockcoders/nestjs-ethers/pull/135) Fix typo getSigneroken to getSignerToken by [@hanchchch](https://github.com/hanchchch)

## 1.0.1
Published by **[blockcoders](https://github.com/blockcoders)** on **2022/01/15**
- [#133](https://github.com/blockcoders/nestjs-ethers/pull/133) Update dependencies

## 1.0.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/09/16**
- [#129](https://github.com/blockcoders/nestjs-ethers/pull/129) Add module context token
- [#128](https://github.com/blockcoders/nestjs-ethers/pull/128) Add option waitUntilIsConnected 
- [#127](https://github.com/blockcoders/nestjs-ethers/pull/127) Custom StaticJsonRpcProvider
- [#126](https://github.com/blockcoders/nestjs-ethers/pull/126) BscScan Provider
- [#125](https://github.com/blockcoders/nestjs-ethers/pull/125) Add precommit 
- [#124](https://github.com/blockcoders/nestjs-ethers/pull/124) Add new network chains
- [#123](https://github.com/blockcoders/nestjs-ethers/pull/123) Export everything in ethers module
- [#122](https://github.com/blockcoders/nestjs-ethers/pull/122) Update ethers to 5.4.6
- [#119](https://github.com/blockcoders/nestjs-ethers/pull/119) Remove dependabot.yml
- [#118](https://github.com/blockcoders/nestjs-ethers/pull/118) Update eslint

### BREAKING CHANGE
- Replace `EthersBaseProvider` with ethers `BaseProvider` interface.
- Replace `SmartContractInterface` with ethers `ContractInterface` interface.
- Replace `WalletSigner` with ethers `Wallet` interface.
- Replace `SmartContractFactory` with ethers `ContractFactory` interface.
- `RandomWalletSignerOptions` was renamed to `RandomWalletOptions`
- `EthersSigner` and `EthersContract` are not longer part of the global export. Now these two provider are injected in `forRoot` and `forRootAsync`.
- `@InjectContractProvider`  decorator declares the `EthersContract` class as a class that can be managed by the Nest IoC container.
- `@InjectSignerProvider` decorator declares the `EthersSigner` class as a class that can be managed by the Nest IoC .

## 0.3.2
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/08/12**
- [#111](https://github.com/blockcoders/nestjs-ethers/pull/111) Update dependencies
- [#110](https://github.com/blockcoders/nestjs-ethers/pull/110) Remove Dependabot Badge

## 0.3.1
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/07/13**
- [#93](https://github.com/blockcoders/nestjs-ethers/pull/93) Update dependencies

## 0.3.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/04/21**
- [#19](https://github.com/blockcoders/nestjs-ethers/pull/19) Release v0.3.0 - EthersContract implementation
- [#18](https://github.com/blockcoders/nestjs-ethers/pull/18) Add EthersContract to the README
- [#17](https://github.com/blockcoders/nestjs-ethers/pull/17) Add SmartContract creation

## 0.2.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/04/17**
- [#16](https://github.com/blockcoders/nestjs-ethers/pull/16) Release v0.2.0 - EthersSigner implementation
- [#15](https://github.com/blockcoders/nestjs-ethers/pull/15) Update Readme with EthersSigner
- [#14](https://github.com/blockcoders/nestjs-ethers/pull/14) Update PULL_REQUEST_TEMPLATE
- [#13](https://github.com/blockcoders/nestjs-ethers/pull/13) Add wallet signer service

### BREAKING CHANGE
- Removed `providerName` option from `forRoot` and `forRootAsync` functions.

## 0.1.0
Published by **[blockcoders](https://github.com/blockcoders)** on **2021/04/14**
- [#10](https://github.com/blockcoders/nestjs-ethers/pull/10) Release v0.1.0 - Ethereum Module implementation for NestJS based on [Ethers.js](https://github.com/ethers-io/ethers.js/)
