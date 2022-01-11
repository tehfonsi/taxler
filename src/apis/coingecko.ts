import { Config } from '../common/config';
import { DI } from '../di.config';
import { Coin } from '../plugins/common/plugin';
import Api, { Price } from './api';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export default class Coingecko extends Api {
  private _config: Config = DI().get('Config');

  public async findMatch(symbol: string, name?: string): Promise<Coin | null> {
    symbol = symbol.toLowerCase();
    const list = (await this.getJson(
      BASE_URL + '/coins/list?include_platform=false'
    )) as Array<any>;
    if (!list) {
      return Promise.resolve(null);
    }
    const candidates = list.filter(
      (coin: any) => coin.symbol.toLowerCase() === symbol
    );
    if (candidates.length > 1 && !name) {
      console.warn(`Found multipe coins with symbol ${symbol}: `, candidates);
    } else if (candidates.length > 1 && name) {
      name = name.toLowerCase();
      const candidate = list.find(
        (coin: any) => coin.name.toLowerCase() === name
      );
      return this._getCoin(candidate);
    } else if (candidates.length > 0) {
      return this._getCoin(candidates[0]);
    } else if (this._config.fiat === symbol) {
      return {
        id: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        symbol: symbol.toUpperCase(),
      };
    } else {
      console.warn(`Coin ${symbol} not found!`);
    }
    return null;
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
    const dateString =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const data = await this.getJson(
      `${BASE_URL}/coins/${coin.id}/history?date=${dateString}`
    );
    if (!data) {
      return null;
    }
    return {
      price: data.market_data.current_price[this._config.fiat],
      coin,
    };
  }
}
