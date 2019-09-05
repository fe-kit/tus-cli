const chalk = require('chalk');
const semver = require('semver');
const getVersions = require('./getVersions');
const { clearConsole } = require('./logger');

exports.generateTitle = async function (checkUpdate) {
  const { current, latest } = await getVersions();
  let title = chalk.bold.blue(`TUS CLI v${current}`);
  if (checkUpdate && semver.gt(latest, current)) {
    title += chalk.green(`
┌────────────────────${`─`.repeat(latest.length)}──┐
│  Update available: ${latest}  │
└────────────────────${`─`.repeat(latest.length)}──┘`);
  }

  return title;
};

exports.clearConsole = async function clearConsoleWithTitle(checkUpdate) {
  const title = await exports.generateTitle(checkUpdate);
  clearConsole(title);
};
