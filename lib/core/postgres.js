async function pgSchemas(app) {
  try {
    const converter = require('../api/common/utils/pgTablesToJsonSchema');
    const schemas = await converter({
      pgHost: app.config.databases.postgres.host,
      pgPort: app.config.databases.postgres.port,
      pgUser: app.config.databases.postgres.user,
      pgPassword: app.config.databases.postgres.password,
      pgDatabase: app.config.databases.postgres.database,
      pgSchema: 'public',
      baseUrl: 'http://yourhost/schema/',
      indent: 2,
    });
    app.spinner.text = 'Loading Postgres Schemas...';
    return schemas;
  } catch (e) {
    console.log('loadSchemas', e);
    return false;
  }
}


async function postgres(app) {
  try {
    if (app.config.databases && app.config.databases.postgres) {
      app.db = await require('massive')(app.config.databases.postgres, {}, { noWarnings: true });
      app.spinner.text = 'Loading Postgres Database...';
      app.schemas = await pgSchemas(app);
    } else {
      throw new Error('Postgres configuration required.');
    }
    return true;
  } catch (e) {
    console.log('loadPostgres', e);
    return false;
  }
}

module.exports = postgres;
