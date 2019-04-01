
function apm(app, e) {
  // Sentry APM
  if (app.config.apm && app.config.apm.sentry && app.config.apm.sentry.dsn) {
    if (e.stack) app.sentry.captureException(e);
  }
}

async function load(app) {
  try {
    // Sentry APM
    if (app.config.apm && app.config.apm.sentry && app.config.apm.sentry.dsn) {
      app.sentry = require('@sentry/node');
      app.sentry.init(app.config.apm.sentry);
      app.spinner.text = 'Loading APM Sentry';
    }
    return true;
  } catch (e) {
    console.log('loadAPM', e);
    return false;
  }
}

module.exports = {
  load,
  apm,
};
