require('dotenv').config();
const ora = require('ora');
const { merge } = require('../utils');
const defaultOptions = require('../configurator');

const self = {};

async function Schedule(options) {
  try {
    self.spinner = ora('PgFy->Schedule').start();
    self.spinner.color = 'yellow';
    self.isSchedule = true;
    self.config = merge(defaultOptions, options);
    self.name = self.config.name;
    // Load Core
    const coreLoaded = await require('../core')(self);
    self.cron = require('node-cron');
    self.moment = require('moment');

    const stop = () => {
      process.exit(0);
    };

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
    self.spinner.clear();
    self.spinner.stop();
    return self;
  } catch (e) {
    console.log('Error loading Schedule', e);
    process.exit(1);
  }
}

module.exports = Schedule;
