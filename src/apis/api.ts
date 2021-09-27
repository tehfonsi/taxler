import fetch from 'node-fetch';
import Cache from '../common/cache';

export default class Api {
  public async getJson(url: string) {
    const cachedText = Cache.get(url);
    if (cachedText) {
      return JSON.parse(cachedText);
    }
    const response = await fetch(url);
    if (response && response.status === 200) {
      const text = await response.text();
      Cache.write(url, text);
      return JSON.parse(text);
    }
    return null;
  }
}
