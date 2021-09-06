import CommonIO from './common-io';
import { EOL } from 'os';

export default class CSVReader {
  public read(
    path: string,
    seperator: string = ',',
    skipFirst: boolean = true
  ): string[][] {
    const csv: string[][] = [];
    const csvFile = CommonIO.readFile(path);
    const lines = csvFile.split(EOL);

    lines.forEach((line, index) => {
      if (skipFirst && index === 0) {
        return;
      }
      const values = line
        .split(seperator)
        .map((value) => value.replace(new RegExp('"', 'g'), ''));
      if (values.length) {
        csv.push(values);
      }
    });

    return csv;
  }
}
