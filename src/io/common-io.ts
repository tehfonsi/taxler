import * as fs from 'fs';

export default class CommonIO {
  static readFile(path: string) {
    return fs.readFileSync(path, 'utf8');
  }

  static writeFile(path: string, content: string) {
    fs.writeFileSync(path, content);
  }

  static createDir(path: string) {
    const exists = fs.existsSync(path);
    if (!exists) {
      fs.mkdirSync(path);
    }
  }

  static exists(path: string) {
    return fs.existsSync(path);
  }
}
