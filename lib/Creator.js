const { logWithSpinner, stopSpinner } = require('../utils/spinner');
const exec = require('child_process').exec;
const chalk = require('chalk');
const execa = require('execa');
const { error, info, log, done } = require('../utils/logger');
const { clearConsole } = require('../utils/clearConsole');
module.exports = class Create {
  constructor(name, context, templateType) {
    this.name = name;
    this.templateType = templateType;
    this.context = context;
    this.create();
  }
  async create() {
    try {
      await clearConsole(true);
      this.gitClone();
    } catch (error) {
      console.info(error);
    }
  }

  async gitClone() {
    const { templateType, name, branch = 'master' } = this;
    logWithSpinner(`√ `, `template start loading ...`);
    const gitCmd = `git clone https://github.com/tjubao/tus-${templateType}.git ${name} && cd ${name} && git checkout ${branch}`;

    exec(gitCmd, async (e) => {
      if (e) {
        error(e);
        process.exit();
      }
      stopSpinner();
      info('√ template load completed!');
      log(`📦  Installing  dependencies...`);

      const child = execa('npm', ['install', '--loglevel', 'error'], {
        cwd: this.context,
        stdio: ['inherit', 'pipe', 'inherit']
      });
      child.stdout.on('data', (buffer) => {
        // let str = buffer.toString().trim();
        process.stdout.write(buffer);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          error(`command failed!`);
          return;
        }
        log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
      });
    });
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }
};
