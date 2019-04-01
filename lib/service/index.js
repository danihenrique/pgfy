require('dotenv').config();
const ora = require('ora');
const _ = require('lodash');

const { merge } = require('../utils');
const defaultOptions = require('../configurator');
const contractTest = require('../core/contractTests');

const self = {};

function processMonitor(service) {
  const { serviceName } = service;
  process.on('SIGINT', () => {
    try {
      console.log('!!SIGINT!!');
      process.exit(0);
    } catch (e) {
      console.error(`${serviceName} ERROR ERROR_SIGINT`, e);
    }
  });

  process.on('uncaughtException', (e) => {
    console.error(`${serviceName} uncaughtException`, e);
    service.apm(service, e);
  });

  process.on('unhandledRejection', (e) => {
    console.error(`${serviceName} unhandledRejection`, e);
    service.apm(service, e);
  });
}

async function Service(name, options) {
  try {
    self.spinner = ora('PgFy->Service').start();
    self.spinner.color = 'yellow';
    self.isService = true;
    self.spinner.text = 'Loading configurations...';
    self.config = merge(defaultOptions, options);
    self.scriptName = name;
    self.servicePath = self.config.service.servicePath;
    self.serviceName = self.scriptName.toLocaleUpperCase();
    self.components = {};
    // Load Core
    self.spinner.text = 'Loading core features...';
    const coreLoaded = await require('../core')(self);
    self.spinner.text = 'Loading components...';
    const componentsLoaded = require('./common/components')(self);
    self.spinner.text = 'Loading modules...';
    const modulesLoaded = require('./common/modules')(self);
    // Runtime testing
    self.spinner.text = 'Loading Contract tests...';
    // eslint-disable-next-line guard-for-in
    for (const component in self.components) {
      self.spinner.text = `Contract-Test->Testing ${component}...`;
      await contractTest(self, component, self.components[component].controller);
    }
    processMonitor(self);
    self.spinner.clear();
    self.spinner.stop();
    return self;
  } catch (e) {
    console.log('Error loading Service', e);
    self.apm(self, e);
  }
}

module.exports = Service;
