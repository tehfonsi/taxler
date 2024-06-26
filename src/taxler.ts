import CommonIO from './io/common-io';
import PluginRegistry from './plugins/plugin-registry';
import Plugin, { COLUMN } from './plugins/common/plugin';
import { EOL } from 'os';
import { injectable } from 'inversify';
import ConfigHelper, { Config } from './common/config';
import Coingecko from './apis/coingecko';
import CryptoCompare from './apis/cryptocompare';
import { DI } from './di.config';

@injectable()
export default class Taxler {
  private _config: Config = DI().get('Config');
  private _path: string;
  private _api: Coingecko | CryptoCompare;

  constructor() {
    if (this._config.cryptocompare_api_key) {
      this._api = new CryptoCompare();
    }
    if (this._config.coingecko_api_key) {
      this._api = new Coingecko();
    }
  }

  public setPath(path: string) {
    this._path = path;
    CommonIO.createDirectory(this._path);
  }

  public init() {
    const pluginList: Plugin[] = PluginRegistry.getPlugins();
    for (const plugin of pluginList) {
      for (const name of plugin.getNames()) {
        CommonIO.createDirectory(this._path + name);
      }
    }

    ConfigHelper.initConfig(this._path);
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

  public async csvReport(
    groupBy: string | undefined,
    typeParam: string | undefined
  ) {
    const report = await this._getReport();
    const headerLine =
      'Date, Type, Plugin, Symbol, Coin, Amount, Price, Total, Taxes' + EOL;
    let csvReport: string = headerLine;
    let csvTypeReport: string = headerLine;

    const groups: any = {};
    const types = typeParam?.split(',')?.map((type) => type.toLowerCase());

    for (let line of report) {
      const csvLine = line.join(',') + EOL;
      csvReport += csvLine;

      if (groupBy && (groupBy === 'coin' || groupBy === 'symbol')) {
        const coin = line[4];
        if (!groups[coin]) {
          groups[coin] = headerLine;
        }
        groups[coin] += csvLine;
      }

      if (types && types.includes(line[1]?.toLowerCase())) {
        csvTypeReport += csvLine;
      }
    }

    CommonIO.writeFile(this._path + 'report_full.csv', csvReport);
    if (types) {
      CommonIO.writeFile(
        this._path + `report_by_types_${types.join(',')}.csv`,
        csvTypeReport
      );
    }

    Object.entries(groups).forEach(([coin, csvReport]) => {
      CommonIO.writeFile(
        this._path + `report_${coin}.csv`,
        csvReport as string
      );
    });
  }

  public async printReport() {
    this._print(await this._getReport());
  }

  private async _print(report: string[][]) {
    let income = 0.0;
    let taxes = 0.0;
    const coins = new Map();
    report.forEach((line: string[]) => {
      const type = line[COLUMN.TYPE];
      if (
        type === 'Lending' ||
        type === 'Mining' ||
        type === 'Liquidity Mining' ||
        type === 'Staking'
      ) {
        income += parseFloat(line[COLUMN.TOTAL]);
        taxes += parseFloat(line[COLUMN.TAXES]);
        const coinData = coins.get(line[COLUMN.COIN_SYMBOL]);
        if (coinData) {
          coins.set(line[COLUMN.COIN_SYMBOL], {
            total: coinData.total + parseFloat(line[COLUMN.AMOUNT]),
            name: line[COLUMN.COIN_NAME],
          });
        } else {
          coins.set(line[COLUMN.COIN_SYMBOL], {
            total: parseFloat(line[COLUMN.AMOUNT]),
            name: line[COLUMN.COIN_NAME],
          });
        }
      }
      console.log(line.join());
    });

    if (this._api) {
      let currentIncome = 0;
      for (let { name, value: coinData } of Array.from(
        coins,
        ([name, value]) => ({
          name,
          value,
        })
      )) {
        const price = await this._api.getPrice(name, new Date(), coinData.name);
        if (!price) {
          continue;
        }
        const currentValue = price.price * coinData.total;
        currentIncome += currentValue;
        console.log(`${name}: ${currentValue}`);
      }
      console.log(
        `Income: ${income} (current value: ${currentIncome}), Taxes: ${taxes}`
      );
    }
  }

  private _getPlugin(name: string): Plugin | undefined {
    const pluginList: Plugin[] = PluginRegistry.getPlugins();

    return pluginList.find((plugin: Plugin) =>
      plugin.getNames().includes(name)
    );
  }
}
