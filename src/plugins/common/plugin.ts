import { EOL } from 'os';
import Coingecko from '../../apis/coingecko';
import { Config } from '../../common/config';
import { formateReportDate } from '../../common/utils';
import { DI } from '../../di.config';
import CommonIO from '../../io/common-io';
import CSVReader from '../../io/csv-reader';

export enum TRANSACTION_TYPE {
  UNKNOWN = 'Unkown',
  MINING = 'Mining',
  LIQUIDITY_MINING = 'Liquidity Mining',
  LENDING = 'Lending',
  STAKING = 'Staking',
  TRADING = 'Trading',
  BUY = 'Buy',
  SELL = 'Sell',
  GIFT = 'Gift',
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
}

const DECIMAL_PLACES = 10;

const REPORT_FILE = '_report.csv';

export default abstract class Plugin {
  private _config: Config = DI().get('Config');
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
    const _total = total === undefined ? amount * price : total;
    const _price = price > 0 ? price.toFixed(DECIMAL_PLACES) : '0';
    return [
      formateReportDate(date),
      type.toString(),
      name,
      coin,
      amount.toFixed(DECIMAL_PLACES),
      _price,
      _total.toFixed(DECIMAL_PLACES),
      this._calculateTax(_total, type).toFixed(DECIMAL_PLACES),
    ];
  }

  public async getReport(path: string): Promise<string[][]> {
    const report: string[][] = [];

    const files = CommonIO.getFiles(path);

    for (const file of files) {
      const filePath = path + '/' + file;
      if (file.includes(REPORT_FILE)) {
        continue;
      }
      const fileReport = await this._readFile(filePath);
      if (fileReport.length === 0) {
        console.warn(`Possible problems with report for ${file}`);
      }
      this._writeFileReport(filePath.replace('.csv', REPORT_FILE), fileReport);
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

  private _calculateTax(value: number, type: TRANSACTION_TYPE) {
    const config = this._config;
    if (!config.taxes) {
      return 0;
    }
    const taxes = config.taxes;
    if (type === TRANSACTION_TYPE.MINING) {
      return value * taxes.mining;
    }
    if (type === TRANSACTION_TYPE.TRADING) {
      return value * taxes.trading;
    }
    if (type === TRANSACTION_TYPE.STAKING) {
      return value * taxes.staking;
    }
    if (type === TRANSACTION_TYPE.LENDING) {
      return value * taxes.lending;
    }
    if (type === TRANSACTION_TYPE.LIQUIDITY_MINING) {
      return value * taxes.liquidityMining;
    }
    if (type === TRANSACTION_TYPE.GIFT) {
      return value * taxes.gift;
    }
    return 0;
  }
}
