import Coingecko from '../../apis/coingecko';
import CommonIO from '../../io/common-io';
import CSVReader from '../../io/csv-reader';

export default abstract class Plugin {
  protected _api = new Coingecko();

  abstract convertRow(line: string[]): Promise<string[] | null>;

  public abstract getNames(): string[];

  public async getReport(path: string): Promise<string[][]> {
    let report: string[][] = [];

    const files = CommonIO.getFiles(path);

    for (const file of files) {
      const fileReport = await this._readFile(path + '/' + file);
      fileReport.forEach((row) => report.push(row));
    }

    return report;
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
