import { Config } from '../common/config';
import { DI } from '../di.config';
import Api from './api';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export default class Coingecko extends Api {
  private _config: Config = DI().get('Config');

  public async findMatch(name: string): Promise<string | null> {
    name = name.toLowerCase();
    const list = (await this.getJson(
      BASE_URL + '/coins/list?include_platform=false'
    )) as Array<any>;
    const coin = list.find((coin: any) => coin.symbol.toLowerCase() === name);
    if (coin) {
      return coin.id;
    } else {
      console.warn(`Coin ${name} not found!`);
    }
    return null;
  }

  public async getPrice(name: string, date: Date) {
    const coinId = await this.findMatch(name);
    if (!coinId) {
      return null;
    }
    const dateString =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const data = await this.getJson(
      `${BASE_URL}/coins/${coinId}/history?date=${dateString}`
    );
    return data.market_data.current_price[this._config.fiat];
  }
}
function Config(Config: any) {
  throw new Error('Function not implemented.');
}
