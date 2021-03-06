import CommonIO from './common-io';
import { EOL } from 'os';

export default class CSVReader {
  public static read(
    path: string,
    seperator: string = ',',
    skipFirst: boolean = true
  ): string[][] {
    const csv: string[][] = [];
    const csvFile = CommonIO.readFile(path).trim();
    let lines = [];
    if (csvFile.includes(EOL)) {
      lines = csvFile.split(EOL);
    } else {
      lines = csvFile.split('\n');
    }

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
