import fetch from 'node-fetch';
import Cache from '../common/cache';
import { Coin } from '../plugins/common/plugin';
import { sleep } from '../common/utils';

export type Price = {
  price: number;
  coin: Coin;
};

export default class Api {
  public async getJson(url: string): Promise<any | null> {
    const cachedText = Cache.get(url);
    if (cachedText && !cachedText.includes('Error')) {
      return JSON.parse(cachedText);
    }
    const response = await fetch(url);
    if (response && response.status === 200) {
      const text = await response.text();
      Cache.write(url, text);
      return JSON.parse(text);
    }
    if (response.status > 299) {
      console.error(`Error ${response.status} for ${url}`);
      return null;
    }
    if (response.status === 429) {
      console.log(
        `Hit rate limit (${response.status}), trying again in 6 seconds...`,
        url
      );
      await sleep(6000);
      return this.getJson(url);
    }
    return null;
  }
}
