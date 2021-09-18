import { DI } from '../di.config';
import CommonIO from '../io/common-io';

export default class Cache {
  private static CACHE_DIRECTORY: string;

  public static getCacheDirectory() {
    if (!this.CACHE_DIRECTORY) {
      this.CACHE_DIRECTORY = (DI().get('Path') as string) + '.cache';
    }
    return this.CACHE_DIRECTORY;
  }
  public static write(key: string, value: string) {
    key = encodeURIComponent(key);
    CommonIO.createDirectory(this.getCacheDirectory());
    const path = this.getPath(key);
    CommonIO.writeFile(path, value);
  }

  public static get(key: string) {
    key = encodeURIComponent(key);
    const path = this.getPath(key);
    if (CommonIO.exists(path)) {
      return CommonIO.readFile(path);
    }
    return null;
  }

  private static getPath(key: string) {
    return this.getCacheDirectory() + '/' + key;
  }
}
