import CommonIO from '../io/common-io';
import { injectable } from 'inversify';
import { mergeDeep } from './utils';

export interface Config {
  fiat: string;
  taxes: {
    mining: number;
    trading: number;
    staking: number;
    lending: number;
    liquidityMining: number;
    gift: number;
  };
}

export const DEFAULT_CONFIG: Config = {
  fiat: 'EUR',
  taxes: {
    mining: 0,
    trading: 0,
    staking: 0,
    lending: 0,
    liquidityMining: 0,
    gift: 0,
  },
};

export default class ConfigHelper {
  private static _configJson: Config;

  public static initConfig(path: string) {
    let config: Config = DEFAULT_CONFIG;
    if (CommonIO.exists(this.getConfigFile(path))) {
      const existingConfig = this.get(path);
      config = mergeDeep(DEFAULT_CONFIG, existingConfig);
    } else {
      CommonIO.createDirectory(path);
    }
    CommonIO.writeFile(
      this.getConfigFile(path),
      JSON.stringify(config, null, 2)
    );
    return config;
  }

  public static get(path: string): Config {
    const configPath = this.getConfigFile(path);
    if (!this._configJson) {
      if (CommonIO.exists(configPath)) {
        this._configJson = JSON.parse(CommonIO.readFile(configPath));
      } else {
        this._configJson = this.initConfig(path);
      }
    }
    return this._configJson;
  }

  public static getConfigFile(path: string) {
    return path + 'config.json';
  }
}
