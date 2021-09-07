import CommonIO from './io/common-io';
import PluginRegistry from './plugins/plugin-registry';
import Plugin from './plugins/common/plugin';

export default class Taxler {
  private _path: string;

  constructor(path: string = '.') {
    this._path = path;
  }

  async printReport() {
    const directories = CommonIO.getDirectories(this._path);
    const report: string[][] = [];

    for (const directory of directories) {
      const plugin = this._getPlugin(directory);
      if (plugin) {
        const pluginReport = await plugin.getReport(this._path + directory);
        pluginReport.forEach((row) => report.push(row));
      }
    }

    this._print(report);
  }

  private _print(report: string[][]) {
    let income = 0.0;
    report.forEach((line: string[]) => {
      income += parseFloat(line[4]);
      console.log(line.join());
    });
    console.log(income);
  }

  private _getPlugin(name: string): Plugin | undefined {
    const pluginList: Plugin[] = PluginRegistry.getPlugins();

    return pluginList.find((plugin: Plugin) =>
      plugin.getNames().includes(name)
    );
  }
}
