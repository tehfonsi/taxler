# Taxler
Crypto taxes for 	~~trading~~ (not yet), mining, liquidity mining, staking and lending. Taxler is currently an alpha version and there is no guarantee that calculations are correct and complete. Use at your own risk.

![npm](https://img.shields.io/npm/v/taxler)

## Usage

- _If needed install [Node](https://nodejs.org/en/)_
- Navigate to the folder you want to save your transactions and reports.
- Run this to init the folder
  ```node
  npx taxler init
  ```
- Copy your files to the correct folders and adapt `config.json`.
- Run taxler
  ```node
  npx taxler
  ```

## Demo

Open the [Stackblitz Taxler Demo](https://stackblitz.com/edit/taxler-demo-1-0-4?devtoolsheight=33&file=README.md) and follow the instructions in the `README` file.

## Current plugins

- [CakeDefi](./src/plugins/cakedefi.ts)
- [BlockFi](./src/plugins/blockfi.ts)
- [Etherscan/Polygonscan](./src/plugins/etherscan.ts)

## Contribute

You can contribute to this project by writing a new plugin.
It is as easy as creating a new file in the [Plugin Folder](./src/plugins) and then register it in the [Plugin Registry](./src/plugins/plugin-registry.ts).

It just requires a few lines of code, take a look at the plugins listed above by clicking on them.

## Support this project

Please use my referral code when signin to
- [CakeDefi](https://app.cakedefi.com/?ref=604069) - Code `604069`
- [BlockFi](https://blockfi.com/?ref=ce5c942d) - Code `ce5c942d`


---
Crypto lookups are powered by [CoinGecko API](https://www.coingecko.com/en/api)!