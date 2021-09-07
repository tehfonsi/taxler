import * as fs from 'fs';

export default class CommonIO {
  static readFile(path: string) {
    return fs.readFileSync(path, 'utf8');
  }

  static writeFile(path: string, content: string) {
    fs.writeFileSync(path, content);
  }

  static createDirectory(path: string) {
    const exists = fs.existsSync(path);
    if (!exists) {
      fs.mkdirSync(path);
    }
  }

  static exists(path: string) {
    return fs.existsSync(path);
  }

  static getDirectories(path: string) {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent: fs.Dirent) => dirent.isDirectory())
      .map((dirent: fs.Dirent) => dirent.name);
  }

  static getFiles(path: string) {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .map((dirent: fs.Dirent) => dirent.name);
  }
}
