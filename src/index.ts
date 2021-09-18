#!/usr/bin/env node
import 'reflect-metadata';
import Taxler from './taxler';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { initDI } from './di.config';

const getTaxler = (path: string) => {
  path = path.endsWith('/') ? path : path + '/';
  initDI(path);
  const taxler = new Taxler();
  taxler.setPath(path as string);
  return taxler;
};

const init = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  const defaultPath = isDev ? 'test/data/' : '.';

  const argv = await yargs(hideBin(process.argv))
    .scriptName('taxler')
    .usage('taxler')
    .option('p', {
      alias: 'path',
      describe: 'Specif the path to your tax folder',
      type: 'string',
      default: defaultPath,
      nargs: 1,
    })
    .command(
      ['init', 'i'],
      'Setup the current folder, see --path',
      async (yargs) => {
        const { path } = await yargs.argv;
        const taxler = getTaxler(path as string);
        taxler.init();
      }
    ).argv;

  if (!argv._.length) {
    const { path } = argv;
    const taxler = getTaxler(path as string);
    if (isDev) {
      taxler.csvReport();
      taxler.printReport();
    } else {
      taxler.csvReport();
    }
  }
};
init();
