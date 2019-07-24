const fs = require('fs');
const { acceptTypes } = require('../config');
const { info } = require('./logger');

function getAcceptType(argv) {
  let type = argv[3];
  if (!acceptTypes.includes(type)) {
    type = acceptTypes[1];
  }
  return type;
}

function deleteAll(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteAll(curPath);
      } else {
        // delete file
        info(`${curPath} delete`);
        fs.unlinkSync(curPath);
      }
    });
    info(`${path} delete`);
    fs.rmdirSync(path);
  }
}

module.exports = {
  getAcceptType,
  deleteAll
};
