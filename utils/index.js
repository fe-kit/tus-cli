const { acceptTypes } = require('../config');

function getAcceptType(argv) {
  let type = argv[3];
  if (!acceptTypes.includes(type)) {
    type = acceptTypes[1];
  }
  return type;
}

module.exports = {
  getAcceptType
};
