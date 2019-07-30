const { logWithSpinner, stopSpinner } = require('../utils/spinner');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const cmdify = require('cmdify');
const execa = require('execa');
const { error, info, done } = require('../utils/logger');
const { exit } = require('../utils/exit');

module.exports = class Create {
  constructor(name, context, templateType) {
    this.name = name;
    this.templateType = templateType;
    this.context = context;
    this.create();
  }
  create() {
    this.gitClone();
  }

  gitClone2() {
    const { templateType, name, branch = 'master' } = this;
    logWithSpinner(`√ `, `template start loading ...`);
    const cmdStr = `git clone https://github.com/tjubao/tus-${templateType}.git ${name} && cd ${name} && git checkout ${branch}`;
    exec(cmdStr, (error) => {
      if (error) {
        error(error);
        process.exit();
      }
      stopSpinner();
      info('√ template load completed!');
      info('√ start install ...');
      const cmd = spawn(cmdify('npm'), ['install'], {
        stdio: 'inherit'
      });
      cmd.on('close', () => {
        done('Installation done!\n');
        process.exit();
      });
    });
  }

  async gitClone() {
    const { templateType, name, branch = 'master' } = this;
    logWithSpinner(`√ `, `template start loading ...`);
    const cmdStr = `git clone https://github.com/tjubao/tus-${templateType}.git ${name} && cd ${name} && git checkout ${branch}`;

    exec(cmdStr, async (e) => {
      if (e) {
        error(e);
        process.exit();
      }
      stopSpinner();
      info('√ template load completed!');
      info('√ start install ...');

      const child = execa('npm', ['install', '--loglevel', 'error'], {
        cwd: this.context,
        stdio: ['inherit', 'pipe', 'inherit']
      });
      child.stdout.on('data', (buffer) => {
        let str = buffer.toString().trim();
        process.stdout.write(buffer);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          // reject(`command failed: ${command} ${args.join(' ')}`)
          return;
        }
        //resolve()
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
