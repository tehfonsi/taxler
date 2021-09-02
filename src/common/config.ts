import CommonIO from '../io/common-io';

export default class Config {
  private static _configJson: any;

  public static get() {
    if (!this._configJson) {
      this._configJson = JSON.parse(CommonIO.readFile('config.json'));
    }
    return this._configJson;
  }
}
