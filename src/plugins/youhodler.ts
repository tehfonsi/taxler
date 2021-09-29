import moment from 'moment';
import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class Youhodler extends Plugin {
  public getNames(): string[] {
    return ['youhodler'];
  }

  // TransactionId,AccountId,User,Status,Type,Ticker,Version,Amount,Fee,TxHash,CreatedAt
  async convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[4]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const dateString = line[10];
    const date = moment(dateString, 'M/D/YY H:m').toDate(); //5/22/21 19:43
    const coin = line[5].toUpperCase();
    const amount = parseFloat(line[7]);
    const price = await this._api.getPrice(coin, date);

    if (!price) {
      return Promise.resolve(null);
    }

    const row = this.toRow(
      date,
      type,
      'Youhodler',
      price.coin.name,
      price.coin.symbol,
      amount,
      price.price
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('Savings earned')) {
      return TRANSACTION_TYPE.LENDING;
    }
    if (input.includes('Withdrawal')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    if (input.includes('Deposit')) {
      return TRANSACTION_TYPE.DEPOSIT;
    }
    // TODO: info not in export (yet)
    // if (input.includes('Exchange')) {
    //   return TRANSACTION_TYPE.TRADING;
    // }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
