let sessionCached;
const getPackageVersion = require('./getPackageVersion');
const semver = require('semver');
const { saveOptions, loadOptions } = require('../lib/options');
module.exports = async function() {
  if (sessionCached) {
    return sessionCached;
  }
  let latest;
  const { name, version } = require(`../package.json`);
  const { latestVersion = version, lastChecked = 0 } = loadOptions();
  const cached = latestVersion;
  const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24);
  if (daysPassed > 1) {
    latest = await getAndCacheLatestVersion(name, cached);
  } else {
    getAndCacheLatestVersion(cached);
    latest = cached;
  }
  return (sessionCached = {
    current: version,
    latest
  });
};

async function getAndCacheLatestVersion(name, cached) {
  const res = await getPackageVersion(name, 'latest');
  if (res.statusCode === 200) {
    const { version } = res.body;
    if (semver.valid(version) && version !== cached) {
      saveOptions({ latestVersion: version, lastChecked: Date.now() });
      return version;
    }
  }
  return cached;
}
