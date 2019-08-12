const fs = require('fs');
const cloneDeep = require('lodash.clonedeep');
const { getRcPath } = require('../utils/rcPath');
const { error } = require('../utils/logger');
const { createSchema, validate } = require('../utils/validate');

const rcPath = (exports.rcPath = getRcPath('.tusrc'));

const schema = createSchema((joi) =>
  joi.object().keys({
    latestVersion: joi.string().regex(/^\d+\.\d+\.\d+$/),
    lastChecked: joi.date().timestamp(),
    packageManager: joi.string().only(['yarn', 'npm', 'pnpm']),
    useTaobaoRegistry: joi.boolean()
  })
);

exports.defaults = {
  lastChecked: undefined,
  latestVersion: undefined,
  packageManager: undefined,
  useTaobaoRegistry: undefined
};

let cachedOptions;

exports.loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions;
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
    } catch (e) {
      error(
        `Error loading saved preferences: ` +
          `~/.vuerc may be corrupted or have syntax errors. ` +
          `Please fix/delete it and re-run vue-cli in manual mode.\n` +
          `(${e.message})`
      );
      progress.exit(1);
    }
    validate(cachedOptions, schema, () => {
      error(
        `~/.vuerc may be outdated. ` +
          `Please delete it and re-run vue-cli in manual mode.`
      );
    });
    return cachedOptions;
  } else {
    return {};
  }
};

exports.saveOptions = (toSave) => {
  const options = Object.assign(cloneDeep(exports.loadOptions()), toSave);
  for (const key in options) {
    if (!(key in exports.defaults)) {
      delete options[key];
    }
  }
  cachedOptions = options;
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
  } catch (e) {
    error(
      `Error saving preferences: ` +
        `make sure you have write access to ${rcPath}.\n` +
        `(${e.message})`
    );
  }
};
