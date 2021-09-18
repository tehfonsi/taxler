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

## Current plugins

- [CakeDefi](./src/plugins/cakedefi.ts)
- [BlockFi](./src/plugins/blockfi.ts)
- [Etherscan/Polygonscan](./src/plugins/etherscan.ts)
- [CakeDefi](./src/plugins/cakedefi.ts)


## Support this project

Please use my referral code when signin to
- [CakeDefi](https://app.cakedefi.com/?ref=604069) - Code `604069`
- [BlockFi](https://blockfi.com/?ref=ce5c942d) - Code `ce5c942d`


---
Crypto lookups are powered by [CoinGecko API](https://www.coingecko.com/en/api)!