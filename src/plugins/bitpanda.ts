import moment from 'moment';
import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class Bitpanda extends Plugin {
  public getNames(): string[] {
    return ['bitpanda'];
  }

  // "Transaction ID",Timestamp,"Transaction Type",In/Out,"Amount Fiat",Fiat,"Amount Asset",Asset,"Asset market price","Asset market price currency","Asset class","Product ID",Fee,"Fee asset",Spread,"Spread Currency"
  async convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[2]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const date = new Date(Date.parse(line[1]));
    const coin = line[7].toUpperCase();
    let amount
    if (line[6] !== '-') {
       amount = parseFloat(line[6]);
    } else {
       amount = parseFloat(line[4]);
    }
    let name;
    if (coin === 'BEST') {
      name = 'Bitpanda Ecosystem Token';
    }
    const price = await this._api.getPrice(coin, date, name);

    if (!price) {
      return Promise.resolve(null);
    }

    const row = this.toRow(
      date,
      type,
      'Bitpanda',
      price.coin.name,
      price.coin.symbol,
      amount,
      price.price
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('transfer') || input.includes('deposit')) {
      return TRANSACTION_TYPE.DEPOSIT;
    }
    if (input.includes('buy')) {
      return TRANSACTION_TYPE.BUY;
    }
    if (input.includes('withdrawal')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    if (input.includes('sell')) {
      return TRANSACTION_TYPE.SELL;
    }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
