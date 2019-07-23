const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const chalk = require('chalk');
const inquirer = require('inquirer');
const { error, info } = require('../utils/logger');

function overwrite(projectName) {
  let promise;
  try {
    const stat = fs.statSync(path.join(process.cwd(), projectName));
    if (stat.isDirectory()) {
      promise = inquirer.prompt({
        name: 'overwrite',
        type: 'confirm',
        message: `当前目录已经存在，确定要覆盖创建吗?`,
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
  // console.info('result');
  // console.info(result);

  if (!result) {
    // 新的目录
    const { type } = await select();
    templateType = type;
  } else if (result.overwrite) {
    // 覆盖原有目录
  } else {
    // exit
    info('exit!');
  }

  const branch = 'master';
  const cmdStr = `git clone https://github.com/tjubao/tus-${templateType}.git ${projectName} && cd ${projectName} && git checkout ${branch}`;

  exec(cmdStr, (error) => {
    if (error) {
      console.log(error);
      process.exit();
    }
    console.log(chalk.green('\n √ Generation completed!'));
    console.log(`\n cd ${projectName} && npm install \n`);
    exec(`cd ${projectName} && npm install`, function(status, output) {
      console.log('Exit status:', status);
      console.log('Program output:', output);
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
