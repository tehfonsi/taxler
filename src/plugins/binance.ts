import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class Binance extends Plugin {
  public getNames(): string[] {
    return ['binance'];
  }

  // Date, Type, Name, Coin, Amount, Price, Total
  async convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[3]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const date = new Date(Date.parse(line[1]));
    const amount = parseFloat(line[5]);
    const price = await this._api.getPrice(line[4], date);

    if (!price) {
      return Promise.resolve(null);
    }

    const row = this.toRow(
      date,
      type,
      'Binance',
      price.coin.name,
      price.coin.symbol,
      amount,
      price?.price
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('Transaction Related') || input.includes('trading')) {
      return TRANSACTION_TYPE.TRADING;
    }
    if (input.includes('Deposit')) {
      return TRANSACTION_TYPE.DEPOSIT;
    }
    if (input.includes('Withdraw')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    if (input.includes('Withdraw')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
