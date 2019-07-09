#!/usr/bin/env node

process.env.NODE_PATH = __dirname + '/../node_modules/';

const program = require('commander');

program.version(require('../package').version);

program.usage('<command>');

program
  .command('create')
  .description('create a new project from template')
  .alias('c')
  .action((name) => {
    require('../lib/create')(name);
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
