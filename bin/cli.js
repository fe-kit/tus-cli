#!/usr/bin/env node
const program = require('commander');
const utils = require('../utils');
process.env.NODE_PATH = __dirname + '/../node_modules/';
program.version(require('../package').version);
program.usage('<command>');

program
  .command('create')
  .description('create a new project from template')
  .alias('c')
  .action((name) => {
    const type = utils.getAcceptType(process.argv);
    require('../lib/create')(name, type);
  });
program.parse(process.argv);

if (!process.argv.length) {
  program.help();
}
