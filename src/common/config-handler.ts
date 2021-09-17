import CommonIO from '../io/common-io';

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

export default class ConfigHandler {
  private static _configJson: Config;

  public static get(): Config {
    if (!this._configJson) {
      this._configJson = JSON.parse(CommonIO.readFile('config.json'));
    }
    return this._configJson;
  }
}
