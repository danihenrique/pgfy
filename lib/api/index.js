require('dotenv').config();
const ora = require('ora');
const Fastify = require('fastify');
const _ = require('lodash');
const { PluginManager } = require('live-plugin-manager');
const path = require('path');
const fs = require('fs-extra');

const { merge } = require('../utils');
const defaultOptions = require('../configurator');
const contractTest = require('../core/contractTests');

const enableLogger = process.env.PGFY_LOGGER_FILE === 'true';
const fastifyOptions = {};
if (enableLogger) {
  const logPath = path.join(process.cwd(), 'logs/pgfy.log');
  fs.ensureFileSync(logPath);
  fastifyOptions.logger = {
    level: process.env.NODE_ENV === 'develop' ? 'trace' : 'info',
    file: logPath,
  };
}
const self = new Fastify(fastifyOptions);

function start(callback) {
  if (!callback) {
    self.listen(self.config.api.port, () => {
      console.log(`
        #################################################################### \n
          API ${self.name} started at ${self.config.api.host}:${self.config.api.port} \n
          Connected to ${self.config.databases.postgres.database} database \n
          Access Swagger UI at http://${self.config.api.host}:${self.config.api.port}/documentation \n
        #################################################################### \n
        `);
    });
  } else {
    self.listen(self.config.api.port, callback);
  }
}

function processMonitor(api) {
  const { name } = api;
  process.on('SIGINT', () => {
    try {
      console.log('!!SIGINT!!');
      process.exit(0);
    } catch (e) {
      console.error(`${name} ERROR ERROR_SIGINT`, e);
    }
  });
  process.on('uncaughtException', (e) => {
    console.error(`${name} uncaughtException`, e);
    api.apm(api, e);
  });
  process.on('unhandledRejection', (e) => {
    console.error(`${name} unhandledRejection`, e);
    api.apm(api, e);
  });
}

async function Api(options) {
  try {
    self.spinner = ora('PgFy->Api').start();
    self.spinner.color = 'yellow';
    self.isApi = true;
    self.spinner.text = 'Loading configurations...';
    self.config = merge(defaultOptions, options);
    self.name = self.config.api.name;
    self.host = self.config.api.host;
    self.pluginManager = new PluginManager();
    self.components = {};
    // Load Core
    self.spinner.text = 'Loading core features...';
    const coreLoaded = await require('../core')(self);
    if (!coreLoaded) throw new Error('Error loading Core!');
    // Load Utils Modules
    self.spinner.text = 'Loading Utils Modules...';
    const requireUtilsLoaded = await require('./common/requireUtils')(self);
    if (!requireUtilsLoaded) throw new Error('Error loading Utils!');
    // Load NPM Modules
    self.spinner.text = 'Loading NPM modules...';
    const npmModulesLoaded = await require('./common/npm')(self);
    if (!npmModulesLoaded) throw new Error('Error loading NPM modules!');
    // Load Plugins
    self.spinner.text = 'Loading Fastify plugins...';
    const pluginsLoaded = require('./common/plugins')(self);
    if (!pluginsLoaded) throw new Error('Error loading API plugins!');
    // Load Middlewares
    self.spinner.text = 'Loading Fastify middlewares...';
    const middlewaresLoaded = require('./common/middlewares')(self);
    if (!middlewaresLoaded) throw new Error('Error loading API Middlewares!');
    // Load CRUD Generator
    self.spinner.text = 'Booting components...';
    const crudLoaded = require('./common/generateCrud')(self);
    if (!crudLoaded) throw new Error('Error loading CRUD generator!');
    // Load API Pre-build Modules;
    self.spinner.text = 'Loading Pre-build Modules...';
    const modulesLoaded = require('./common/modules')(self);
    if (!modulesLoaded) throw new Error('Error loading API modules addons!');
    // Load API components;
    self.spinner.text = 'Loading components...';
    const componentsLoaded = require('./common/components')(self);
    if (!componentsLoaded) throw new Error('Error loading Components!');
    // Load API Routes
    // eslint-disable-next-line guard-for-in
    for (const component in self.components) {
      if (self.components[component].routerAuto) {
        self.components[component].routerAuto(
          self,
          component,
          self.components[component].swagger,
          self.components[component].controller,
        );
      }
      if (self.components[component].router) {
        self.components[component].router(
          self,
          component,
          self.components[component].swagger,
          self.components[component].controller,
        );
      }
    }
    self.ready(async (err) => {
      if (err) {
        self.apm(self, err);
      }
      // Runtime testing
      self.spinner.text = 'Loading Contract tests...';
      // eslint-disable-next-line guard-for-in
      for (const component in self.components) {
        self.spinner.text = `Contract-Test->Testing ${component}...`;
        await contractTest(self, component, self.components[component].controller);
      }
      // BY ENV
      if (process.env.NODE_ENV === 'production') {
        //
      } else if (process.env.NODE_ENV === 'development') {
        //
      }
      // Load Swagger UI
      self.spinner.text = 'Loading Swagger UI';
      self.oas();
    });
    // Set Error Handler
    self.setErrorHandler((error, request, reply) => {
      console.log(`setErrorHandler->Error: ${error.message}, Request: ${request.req.method}->${request.req.originalUrl}`);
      reply.send(error);
    });
    self.start = start;
    // Monitor Node Process
    processMonitor(self);
    self.spinner.clear();
    self.spinner.stop();
    return self;
  } catch (e) {
    console.log('Error loading API', e);
    self.apm(self, e);
    process.exit(0);
  }
}

module.exports = Api;
