import CommonIO from '../io/common-io';

export default class Cache {
  static CACHE_DIRECTORY = './_cache';

  public static write(key: string, value: string) {
    key = encodeURIComponent(key);
    CommonIO.createDir(Cache.CACHE_DIRECTORY);
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
    return Cache.CACHE_DIRECTORY + '/' + key;
  }
}
