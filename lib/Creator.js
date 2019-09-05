const { logWithSpinner, stopSpinner } = require('../utils/spinner');
const chalk = require('chalk');
const { error, info, log, done } = require('../utils/logger');
const { clearConsole } = require('../utils/clearConsole');
const { hasYarn, hasPnpm3OrLater } = require('../utils/env');
const { gitClone } = require('../utils/gitcmd');
const { run } = require('../utils/execa');
module.exports = class Create {
  constructor(name, context, templateType) {
    this.name = name;
    this.templateType = templateType;
    this.context = context;
    this.create();
  }
  async create() {
    const { templateType, name } = this;
    const packageManager = (
      (hasYarn() ? 'yarn' : null) ||
      (hasPnpm3OrLater() ? 'pnpm' : 'npm')
    )
    try {
      await clearConsole(true);
      logWithSpinner(`✨`, `Creating project in ${chalk.yellow(this.context)}.`)
      logWithSpinner(`√ `, `template start loading ...`);
      await gitClone(templateType, name);
      stopSpinner();
      info('√ template load completed!');
      run('rm', ['-rf', '.git'], { cwd: this.context })
      this.installDeps();
    } catch (error) {
      console.info(error);
    }
  }

  async installDeps() {
    const { name } = this;
    log(`📦  Installing  dependencies...`);
    const child = run('npm', ['install', '--loglevel', 'error'], {
      cwd: this.context,
      stdio: ['inherit', 'pipe', 'inherit']
    });
    child.stdout.on('data', (buffer) => {
      process.stdout.write(buffer);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        error(`command failed!`);
        return;
      }
      log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
    });
  }
};
