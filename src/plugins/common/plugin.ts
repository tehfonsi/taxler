import { EOL } from 'os';
import Coingecko from '../../apis/coingecko';
import { formateReportDate } from '../../common/utils';
import CommonIO from '../../io/common-io';
import CSVReader from '../../io/csv-reader';

export enum TRANSACTION_TYPE {
  UNKNOWN = 'Unkown',
  MINING = 'Mining',
  LIQUIDITY_MINING = 'Liquidity Mining',
  LENDING = 'Lending',
  STAKING = 'Staking',
  TRADING = 'Trading',
  GIFT = 'Gift',
}

const DECIMAL_PLACES = 10;

export default abstract class Plugin {
  protected _api = new Coingecko();

  public abstract getNames(): string[];

  abstract convertRow(line: string[]): Promise<string[] | null>;

  protected toRow(
    date: Date,
    type: TRANSACTION_TYPE,
    name: string,
    coin: string,
    amount: number,
    price: number,
    total?: number
  ): string[] {
    const _total =
      total === undefined
        ? (amount * price).toFixed(DECIMAL_PLACES)
        : total.toFixed(DECIMAL_PLACES);
    const _price = price > 0 ? price.toFixed(DECIMAL_PLACES) : '0';
    return [
      formateReportDate(date),
      type.toString(),
      name,
      coin,
      amount.toFixed(DECIMAL_PLACES),
      _price,
      _total,
    ];
  }

  public async getReport(path: string): Promise<string[][]> {
    const report: string[][] = [];

    const files = CommonIO.getFiles(path);

    for (const file of files) {
      const filePath = path + '/' + file;
      const fileReport = await this._readFile(filePath);
      this._writeFileReport(
        filePath.replace('.csv', '_report.csv'),
        fileReport
      );
      fileReport.forEach((row) => report.push(row));
    }

    return report;
  }

  private _writeFileReport(path: string, report: string[][]) {
    let csvReport: string =
      'Date, Type, Name, Coin, Amount, Price, Total' + EOL;

    for (let line of report) {
      csvReport += line.join(',') + EOL;
    }

    CommonIO.writeFile(path, csvReport);
  }

  private async _readFile(path: string): Promise<string[][]> {
    const report: string[][] = [];
    const csv = CSVReader.read(path);

    for (const line of csv) {
      const transformedLine = await this.convertRow(line);
      if (transformedLine) {
        report.push(transformedLine);
      }
    }

    return report;
  }
}
