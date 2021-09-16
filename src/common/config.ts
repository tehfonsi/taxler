import CommonIO from '../io/common-io';

export interface ConfigDefinition {
  fiat: number;
  taxes: {
    mining: number;
    trading: number;
    staking: number;
    lending: number;
    liquidityMining: number;
    gift: number;
  };
}

export default class Config {
  private static _configJson: ConfigDefinition;

  public static get(): ConfigDefinition {
    if (!this._configJson) {
      this._configJson = JSON.parse(CommonIO.readFile('config.json'));
    }
    return this._configJson;
  }
}
