const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const inquirer = require('inquirer');
const cmdify = require('cmdify');
const { error, info, done } = require('../utils/logger');
const { deleteAll } = require('../utils/index');
function overwrite(projectName) {
  let promise;
  try {
    const stat = fs.statSync(path.join(process.cwd(), projectName));
    if (stat.isDirectory()) {
      promise = inquirer.prompt({
        name: 'overwrite',
        type: 'confirm',
        message: `当前目录已经存在，确定要覆盖吗?`,
        when: (val) => {
          return new Promise((resolve, reject) => {
            if (val) {
              resolve(val);
            } else reject('');
          });
        }
      });
    } else {
    }
  } catch (e) {}
  return promise;
}

function select() {
  return inquirer.prompt({
    type: 'list',
    name: 'type',
    message: '请选择需要创建的类型？',
    choices: ['React', 'Vue'],
    filter: function(val) {
      return Promise.resolve(val.toLowerCase());
    }
  });
}

async function create(projectName) {
  let templateType = 'react';
  let result = await overwrite(projectName);
  // !result 新目录
  // result.overwrite=true 新覆盖创建目录
  if (result) {
    const { overwrite } = result;
    if (overwrite) {
      deleteAll(`./${projectName}`);
    } else {
      info('exit!');
      process.exit();
    }
  }

  const { type } = await select();
  templateType = type;

  const branch = 'master';
  const cmdStr = `git clone https://github.com/tjubao/tus-${templateType}.git ${projectName} && cd ${projectName} && git checkout ${branch}`;
  info('√ template start loading ...');
  exec(cmdStr, (error) => {
    if (error) {
      error(error);
      process.exit();
    }
    info('√ template load completed!');
    info('√ start install ...');
    // console.log(chalk.green('\n √ Generation completed!'));
    const cmd = spawn(cmdify('npm'), ['install'], {
      stdio: 'inherit'
    });
    cmd.on('close', () => {
      done('Installation done!\n');
      process.exit();
    });
  });
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    //stopSpinner(false); // do not persist
    error(err);
  });
};
