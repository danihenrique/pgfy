async function logger(app) {
  try {
    // Timber logger
    if (app.config.logger && app.config.logger.timber && app.config.logger.timber.key) {
      const bunyan = require('bunyan');
      const timber = require('timber');
      const transport = new timber.transports.HTTPS(app.config.logger.timber);
      timber.install(transport);
      app.logger = bunyan.createLogger({
        name: app.config.api.name,
        stream: new timber.transports.Bunyan(),
      });
    } else {
      // TODO: add to app.logger an default logger client
      app.spinner.text = 'Logger->Default console.log';
    }
    return true;
  } catch (e) {
    console.log('loadLogger', e);
    return false;
  }
}

module.exports = logger;
