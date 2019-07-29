const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const inquirer = require('inquirer');
const cmdify = require('cmdify');
const { error, info, done } = require('../utils/logger');
const { exit } = require('../utils/exit');
const validateProjectName = require('validate-npm-package-name');

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd(); //返回的是当前Node进程执行时的工作目录
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');
  const { type, force } = options;
  let templateType = 'react';
  const result = validateProjectName(projectName);
  if (!result.validForNewPackages) {
    // 包名无效errors提示或者就包名warnings提示
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim('Error: ' + err));
      });
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim('Warning: ' + warn));
      });
    exit(1); // process.exit() 方法以退出状态 code 指示 Node.js 同步地终止进程。 如果省略 code，则使用成功代码 0 或 process.exitCode 的值（如果已设置）退出。 在调用所有的 'exit' 事件监听器之前，Node.js 不会终止
  }
  // create project type
  if (!type || !['React', 'Vue'].concat(type)) {
    const { createType } = await inquirer.prompt({
      type: 'list',
      name: 'createType',
      message: '请选择需要创建的类型？',
      choices: [
        {
          name: 'React',
          value: 'react'
        },
        {
          name: 'Vue',
          value: 'vue'
        }
      ]
    });
    templateType = createType;
  }

  if (fs.existsSync(targetDir)) {
    // 目录已经存在
    if (force) {
      await fs.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(
            targetDir
          )} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: true },
            { name: 'Cancel', value: false }
          ]
        }
      ]);
      if (action) {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      } else {
        exit();
      }
    }
  }

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
