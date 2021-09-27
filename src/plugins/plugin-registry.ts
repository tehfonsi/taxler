import BlockFi from './blockfi';
import CakeDefi from './cakedefi';
import Etherscan from './etherscan';
import Plugin from './common/plugin';
import Youhodler from './youhodler';

export default class PluginRegistry {
  public static getPlugins(): Plugin[] {
    const directory: Plugin[] = [];

    directory.push(new Etherscan());
    directory.push(new CakeDefi());
    directory.push(new BlockFi());
    directory.push(new Youhodler());

    return directory;
  }
}
