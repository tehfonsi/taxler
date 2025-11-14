import Plugin, { TRANSACTION_TYPE } from './common/plugin';

export default class Etherscan extends Plugin {
  getNames(): string[] {
    return ['solscan'];
  }

//   Signature,Block Time,Human Time,Action,From,To,Amount,Flow,Value,Decimals,Token Address, Multiplier
// 5mdVSXmpYJidgdqx4ie1CLDb7r1T6XHUgwtjEoXD3tNS1aopXL48UUT5pfi59XWTm5hQY2HLMq45CeGXuW5r692K,1735455666,2024-12-29T07:01:06.000Z,TRANSFER,rav3GKV8KXg4AvswaqT9HWJ4ErxU5csUwTKj549aHUH,34wP3R8CDkF1PUdorxVXYmH7c33oFXCzkzUw1nwjMNna,2048267794,in,145.63,8,rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof,1.0
  async convertRow(line: string[]): Promise<string[] | null> {
    const csvToken = line[10].replace('rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof', 'RNDR');
    const csvTimestamp = line[1];
    const csvAmount = line[6];
    if (!csvToken || !csvTimestamp) {
      console.warn(
        `Token (${csvToken}) or timestamp (${csvTimestamp}) not found!)`
      );
      return null;
    }
    const timestamp = parseInt(csvTimestamp);
    const date = new Date(timestamp * 1000);
    const price = await this._api.getPrice(csvToken, date);
    if (!price || price.price <= 0) {
      return null;
    }
    const amount = parseInt(csvAmount) / 100_000_000;
    
    if (!csvToken.includes('RNDR')) {
      console.log(csvToken, csvAmount, amount);
    }

    return this.toRow(
      date,
      TRANSACTION_TYPE.MINING,
      'Solscan',
      price.coin.name,
      price.coin.symbol,
      amount,
      price.price
    );
  }
}
