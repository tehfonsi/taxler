import Coingecko from '../apis/coingecko';
import CSVReader from '../io/csv-reader';
import Report from '../common/report';
import { formateReportDate } from '../common/utils';

export default class Polygonscan extends CSVReader implements Report {
  private _path: string;
  private _coingecko = new Coingecko();

  constructor(path: string) {
    super();
    this._path = path;
  }

  public async getReport(): Promise<string[][]> {
    const report: string[][] = [];
    const csv = this.read(this._path);

    for (const line of csv) {
      const transformedLine = await this._transformLine(line);
      if (transformedLine) {
        report.push(transformedLine);
      }
    }

    return report;
  }

  // "Txhash","UnixTimestamp","DateTime","From","To","Value","ContractAddress","TokenName","TokenSymbol"
  private async _transformLine(line: string[]): Promise<string[] | null> {
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
    transformedLine.push('Polygonscan');

    transformedLine.push(csvToken);
    const price = await this._coingecko.getPrice(csvToken, date);
    transformedLine.push(price);
    // value
    const value = parseFloat(csvValue);
    transformedLine.push(value);
    transformedLine.push(value * price);

    return transformedLine;
  }
}
