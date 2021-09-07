import Plugin from './common/plugin';
import Etherscan from './etherscan';

export default class PluginRegistry {
  public static getPlugins(): Plugin[] {
    const directory: Plugin[] = [];

    directory.push(new Etherscan());

    return directory;
  }
}
