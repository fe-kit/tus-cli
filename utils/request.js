exports.request = {
  get(uri) {
    const request = require('request-promise-native');
    // lazy require
    const reqOpts = {
      method: 'GET',
      timeout: 30000,
      resolveWithFullResponse: true,
      json: true,
      uri
    };

    return request(reqOpts);
  }
};
