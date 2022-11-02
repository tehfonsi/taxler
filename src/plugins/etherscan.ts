import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class Etherscan extends Plugin {
  getNames(): string[] {
    return ['etherscan', 'polygonscan'];
  }

  // "Txhash","UnixTimestamp","DateTime","From","To","Value","ContractAddress","TokenName","TokenSymbol"
  // "Txhash","UnixTimestamp","DateTime","From","To","TokenValue","USDValueDayOfTx","ContractAddress","TokenName","TokenSymbol"
  async convertRow(line: string[]): Promise<string[] | null> {
    const csvToken = line[9] || line[8];
    const csvTimestamp = line[1];
    const csvAmount = line[5];
    if (!csvToken || !csvTimestamp) {
      console.warn(
        `Token (${csvToken}) or timestamp (${csvTimestamp}) not found!)`
      );
      return null;
    }
    const timestamp = parseInt(csvTimestamp);
    const date = new Date(timestamp * 1000);
    const price = await this._api.getPrice(csvToken, date);
    if (!price || price.price <= 0) {
      return null;
    }
    const amount = parseFloat(csvAmount);

    return this.toRow(
      date,
      TRANSACTION_TYPE.MINING,
      'Etherscan',
      price.coin.name,
      price.coin.symbol,
      amount,
      price.price
    );
  }
}
