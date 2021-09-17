import CommonIO from './io/common-io';
import PluginRegistry from './plugins/plugin-registry';
import Plugin from './plugins/common/plugin';
import { EOL } from 'os';

export default class Taxler {
  private _path: string;

  constructor(path: string = '.') {
    this._path = path;
  }

  public setPath(path: string | undefined) {
    if (path) {
      this._path = path.endsWith('/') ? path : path + '/';
    }
    CommonIO.createDirectory(this._path);
  }

  public init() {
    const pluginList: Plugin[] = PluginRegistry.getPlugins();
    for (const plugin of pluginList) {
      for (const name of plugin.getNames()) {
        CommonIO.createDirectory(this._path + name);
      }
    }
  }

  private async _getReport(): Promise<string[][]> {
    const directories = CommonIO.getDirectories(this._path);
    const report: string[][] = [];

    for (const directory of directories) {
      const plugin = this._getPlugin(directory);
      if (plugin) {
        const pluginReport = await plugin.getReport(this._path + directory);
        pluginReport.forEach((row) => report.push(row));
      }
    }

    report.sort((line1, line2) => {
      if (line1[0] < line2[0]) {
        return -1;
      }
      if (line1[0] > line2[0]) {
        return 1;
      }
      return 0;
    });

    return report;
  }

  public async csvReport() {
    const report = await this._getReport();
    let csvReport: string =
      'Date, Type, Name, Coin, Amount, Price, Total, Taxes' + EOL;

    for (let line of report) {
      csvReport += line.join(',') + EOL;
    }

    CommonIO.writeFile(this._path + 'report.csv', csvReport);
  }

  public async printReport() {
    this._print(await this._getReport());
  }

  private _print(report: string[][]) {
    let amount = 0.0;
    let income = 0.0;
    let taxes = 0.0;
    report.forEach((line: string[]) => {
      amount += parseFloat(line[4]);
      income += parseFloat(line[6]);
      taxes += parseFloat(line[7]);
      console.log(line.join());
    });
    console.log(amount + ', ' + income + ', ' + taxes);
  }

  private _getPlugin(name: string): Plugin | undefined {
    const pluginList: Plugin[] = PluginRegistry.getPlugins();

    return pluginList.find((plugin: Plugin) =>
      plugin.getNames().includes(name)
    );
  }
}
