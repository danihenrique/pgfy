require('dotenv').config();
const path = require('path');
const ora = require('ora');
const { migrate } = require('postgres-migrations');
const { merge } = require('../utils');
const defaultOptions = require('../configurator');

const self = {};

async function Migrations(options) {
  try {
    self.spinner = ora('PgFy->Migrations').start();
    self.spinner.color = 'yellow';
    self.isMigration = true;
    self.config = merge(defaultOptions, options);
    const rootPath = path.resolve(__dirname, '../../../../');
    self.PATH_MIGRATIONS = `${rootPath}/migrations/`;
    const migrationConfig = {
      host: self.config.databases.postgres.host,
      port: self.config.databases.postgres.port,
      user: self.config.databases.postgres.user,
      password: self.config.databases.postgres.password,
      database: self.config.databases.postgres.database,
    };

    self.execute = async () => {
      self.job = await migrate(migrationConfig, self.PATH_MIGRATIONS);
    };

    const stop = () => {
      process.exit(0);
    };

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
    self.spinner.clear();
    self.spinner.stop();
    return self;
  } catch (e) {
    console.log('Error loading Mirations', e);
    process.exit(1);
  }
}

module.exports = Migrations;
