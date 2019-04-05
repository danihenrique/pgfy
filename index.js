#!/usr/bin/env node
if (require.main === module) {
  module.exports = require('./lib/cli');
} else {
  module.exports = require('./lib');
}
