const exec = require('child_process').exec;
const chalk = require('chalk');
const inquirer = require('inquirer');
const { error, stopSpinner, exit } = require('./utils/logger');

async function create(projectName) {
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `Generate project in current directory?`
    }
  ]);
  if (!ok) {
    return;
  }
  const branch = 'master';
  const cmdStr = `git clone https://github.com/tjubao/tus-vue.git ${projectName} && cd ${projectName} && git checkout ${branch}`;

  exec(cmdStr, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      process.exit();
    }
    console.log(chalk.green('\n √ Generation completed!'));
    console.log(`\n cd ${projectName} && npm install \n`);
    process.exit();
  });
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    stopSpinner(false); // do not persist
    error(err);
  });
};
