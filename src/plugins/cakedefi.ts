import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class CakeDefi extends Plugin {
  public getNames(): string[] {
    return ['cakedefi'];
  }

  // Date,Operation,Amount,Coin/Asset,FIAT value,FIAT currency,Transaction ID,Withdrawal address,Reference,Related reference ID
  convertRow(line: string[]): Promise<string[] | null> {
    const type = this._getType(line[1]);
    if (type === TRANSACTION_TYPE.UNKNOWN) {
      return Promise.resolve(null);
    }
    const date = new Date(Date.parse(line[0]));
    const coin = line[3];
    const amount = parseFloat(line[2]);
    const total = parseFloat(line[4]);

    const row = this.toRow(
      date,
      type,
      'Cake Defi',
      'DeFiChain',
      coin,
      amount,
      0,
      total
    );
    return Promise.resolve(row);
  }

  private _getType(input: string): TRANSACTION_TYPE {
    if (input.includes('Liquidity mining reward')) {
      return TRANSACTION_TYPE.LIQUIDITY_MINING;
    }
    if (input.includes('Lending reward')) {
      return TRANSACTION_TYPE.LENDING;
    }
    if (
      input.includes('Staking reward') ||
      input.includes('Freezer staking bonus')
    ) {
      return TRANSACTION_TYPE.STAKING;
    }
    if (input.includes('Signup bonus')) {
      return TRANSACTION_TYPE.GIFT;
    }
    if (input.includes('Deposit')) {
      return TRANSACTION_TYPE.DEPOSIT;
    }
    if (input.includes('Withdrawal')) {
      return TRANSACTION_TYPE.WITHDRAW;
    }
    if (input.includes('Swapped in') || input.includes('Swapped out')) {
      return TRANSACTION_TYPE.TRADING;
    }
    return TRANSACTION_TYPE.UNKNOWN;
  }
}
