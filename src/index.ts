#!/usr/bin/env node
import Taxler from './taxler';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const init = async () => {
  const defaultPath =
    process.env.NODE_ENV === 'development' ? 'test/data/' : '.';

  const taxler = new Taxler();
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
        taxler.setPath(path as string);
        console.log(`init the repo on path ${path}`);
      }
    ).argv;

  if (!argv._.length) {
    const { path } = argv;
    taxler.setPath(path as string);
    taxler.printReport();
    taxler.csvReport();
  }
};
init();
