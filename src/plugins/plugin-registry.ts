import BlockFi from './blockfi';
import CakeDefi from './cakedefi';
import Etherscan from './etherscan';
import Plugin from './common/plugin';
import Youhodler from './youhodler';
import DefaultPlugin from './default-plugin';
import Binance from './binance';
import Bitpanda from './bitpanda';
import Solscan from './solscan';

export default class PluginRegistry {
  public static getPlugins(): Plugin[] {
    const directory: Plugin[] = [];

    directory.push(new Etherscan());
    directory.push(new Solscan());
    directory.push(new CakeDefi());
    directory.push(new BlockFi());
    directory.push(new Youhodler());
    directory.push(new DefaultPlugin());
    directory.push(new Binance());
    directory.push(new Bitpanda());

    return directory;
  }
}
