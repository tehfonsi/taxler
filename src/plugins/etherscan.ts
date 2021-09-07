import Plugin from './common/plugin';
import { formateReportDate } from '../common/utils';

export default class Etherscan extends Plugin {
  getNames(): string[] {
    return ['etherscan', 'polygonscan'];
  }

  // "Txhash","UnixTimestamp","DateTime","From","To","Value","ContractAddress","TokenName","TokenSymbol"
  async convertRow(line: string[]): Promise<string[] | null> {
    const transformedLine = [];

    const csvToken = line[8];
    const csvTimestamp = line[1];
    const csvValue = line[5];
    if (!csvToken || !csvTimestamp) {
      return null;
    }
    const timestamp = parseInt(csvTimestamp);
    const date = new Date(timestamp * 1000);

    transformedLine.push(formateReportDate(date));
    transformedLine.push('Etherscan');

    transformedLine.push(csvToken);
    const price = await this._api.getPrice(csvToken, date);
    transformedLine.push(price);
    // value
    const value = parseFloat(csvValue);
    transformedLine.push(value);
    transformedLine.push(value * price);

    return transformedLine;
  }
}
