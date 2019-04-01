const _ = require('lodash');

function customizerMerge(objValue, srcValue) {
  let newValue = {};
  if (Array.isArray(objValue)) {
    newValue = objValue.concat(srcValue);
  } else {
    newValue = _.merge(objValue, srcValue);
  }
  return newValue;
}
const merge = _.partialRight(_.assignInWith, customizerMerge);

module.exports = {
  merge,
};
