#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const utils = require('../utils');
const chalk = require('chalk');
const didYouMean = require('didyoumean');

process.env.NODE_PATH = __dirname + '/../node_modules/';

program.version(require('../package').version).usage('<command> [options]');

program
  .command('create <app-name>')
  .version('0.0.1', '-v, --version')
  .description('create a new project powered by tus-cli')
  .option('-t, --type <typeName>', 'The type of project to be created！')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .alias('c')
  .action((projectName, cmd) => {
    const options = cleanArgs(cmd);
    require('../lib/create')(projectName, options);
  });

// output help information on unknown commands
program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});

program.parse(process.argv);
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function suggestCommands(cmd) {
  const availableCommands = program.commands.map((cmd) => {
    return cmd._name;
  });

  const suggestion = didYouMean(cmd, availableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ''));
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}
