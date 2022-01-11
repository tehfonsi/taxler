import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class BlockFi extends Plugin {
  public getNames(): string[] {
    return ['blockfi'];
  }

  // Cryptocurrency,Amount,Transaction Type,Confirmed At
  async convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[2]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const date = new Date(Date.parse(line[3]));
    const amount = parseFloat(line[1]);
    const price = await this._api.getPrice(line[0], date);

    if (!price) {
      return Promise.resolve(null);
    }

    const row = this.toRow(
      date,
      type,
      'BlockFi',
      price.coin.name,
      price.coin.symbol,
      amount,
      price?.price
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('Interest Payment')) {
      return TRANSACTION_TYPE.LENDING;
    }
    if (input.includes('Bonus Payment')) {
      return TRANSACTION_TYPE.GIFT;
    }
    if (input.includes('Deposit')) {
      return TRANSACTION_TYPE.DEPOSIT;
    }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
