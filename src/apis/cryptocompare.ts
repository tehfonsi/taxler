import { Config } from '../common/config';
import { DI } from '../di.config';
import { Coin } from '../plugins/common/plugin';
import Api, { Price } from './api';

const BASE_URL = 'https://min-api.cryptocompare.com';

let coinList: any[] | null = null;
let coinLookup = new Map<string, Coin>();

export default class CryptoCompare extends Api {
  private _config: Config = DI().get('Config');

  public async findMatch(symbol: string, name?: string): Promise<Coin | null> {
    if (coinLookup.has(symbol)) {
      return Promise.resolve(coinLookup.get(symbol)!);
    }
    symbol = symbol.toLowerCase();
    if (!coinList) {
      const response = await this.getJson(
        BASE_URL + `/data/all/coinlist`
      )
      if (!response) {
        return Promise.resolve(null);
      }

      coinList = [];

      for (const [key, value] of Object.entries((response as any).Data)) {
        coinList.push({
          id: (value as any).Id,
          name: (value as any).CoinName,
          symbol: (value as any).Symbol.toUpperCase(),
        });
      }
    }
    const candidates = coinList.filter(
      (coin: any) => coin.symbol.toLowerCase() === symbol
    );
    let coin = null;
    if (candidates.length > 1 && !name) {
      console.warn(`Found multipe coins with symbol ${symbol}: `, candidates);
    } else if (candidates.length > 1 && name) {
      name = name.toLowerCase();
      const candidate = coinList.find(
        (coin: any) => coin.CoinName.toLowerCase() === name
      );
      coin = this._getCoin(candidate);
    } else if (candidates.length > 0) {
      coin = this._getCoin(candidates[0]);
    } else if (this._config.fiat === symbol) {
      coin = {
        id: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        symbol: symbol.toUpperCase(),
      };
    } else {
      console.warn(`Coin ${symbol} not found!`);
    }
    if (coin) {
      coinLookup.set(symbol, coin);
    }
    return coin;
  }

  private _getCoin(match: any): Coin {
    return {
      id: match.id as string,
      name: match.name as string,
      symbol: (match.symbol as string).toUpperCase(),
    };
  }

  public async getPrice(
    symbol: string,
    date: Date,
    name?: string
  ): Promise<Price | null> {
    const coin = await this.findMatch(symbol, name);
    if (!coin?.id) {
      return null;
    }
    // return if it is fiat
    if (coin.symbol.toLowerCase() === this._config.fiat.toLowerCase()) {
      return {
        price: 1,
        coin,
      };
    }
    const requestDate = new Date(date.getTime());
    requestDate.setHours(12, 0, 0, 0);
    const timestamp = requestDate.getTime() / 1000;
    let url = `${BASE_URL}/data/pricehistorical?fsym=${coin.symbol}&tsyms=${this._config.fiat}&ts=${timestamp}`;
    if (this._config.cryptocompare_api_key) {
      url += `&api_key=${this._config.cryptocompare_api_key}`;
    }
    const data = await this.getJson(url);
    if (!data || !data[coin.symbol][this._config.fiat.toUpperCase()]) {
      return null;
    }
    return {
      price: data[coin.symbol][this._config.fiat.toUpperCase()],
      coin,
    };
  }
}
