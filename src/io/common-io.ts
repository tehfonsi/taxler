import * as fs from 'fs';

export const readFile = (path: string) => {
  return fs.readFileSync(path,'utf8');
}