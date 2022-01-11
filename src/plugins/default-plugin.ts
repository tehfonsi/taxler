import moment from 'moment';
import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class DefaultPlugin extends Plugin {
  public getNames(): string[] {
    return ['legacy', 'others'];
  }

  // Date, Type, Name, Coin, Amount, Price, Total
  async convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[1]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const date = new Date(Date.parse(line[0]));
    const amount = parseFloat(line[4]);
    const price = await this._api.getPrice(line[3], date);

    if (!price) {
      return Promise.resolve(null);
    }

    const row = this.toRow(
      date,
      type,
      line[2],
      price.coin.name,
      price.coin.symbol,
      amount,
      price?.price
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('Buy')) {
      return TRANSACTION_TYPE.BUY;
    }
    if (input.includes('Withdraw')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    if (input.includes('Trading')) {
      return TRANSACTION_TYPE.TRADING;
    }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
