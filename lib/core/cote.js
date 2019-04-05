/* eslint-disable max-len */
require('dotenv').config();

function fixStringifyBug() {
  // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify/18391400#18391400
  if (!('toJSON' in Error.prototype)) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Error.prototype, 'toJSON', {
      value: () => {
        const alt = {};
        Object.getOwnPropertyNames(this).forEach((key) => {
          alt[key] = this[key];
        }, this);
        return alt;
      },
      configurable: true,
      writable: true,
    });
  }
}

fixStringifyBug();

/*
#### Timeout
A timeout could be configured for all Requesters as an environment variable
`COTE_REQUEST_TIMEOUT`, or in advertisement options for specific Requester,
or in a property called `__timeout` in first argument of `requester.send`
method. Latter setting overrides former. Timeout is specified in milliseconds.
 **As environment variable for all requesters:**
COTE_REQUEST_TIMEOUT=1000

 **In advertisement settings:**
new cote.Requester({ name: `Requester with timeout`, timeout: 1000 });
*/

function cote(app) {
  try {
    // Cote Service
    if (app.config.service) {
      app.spinner.text = 'Loading Cote Micro service framework...';
      const coteConfig = {
        helloInterval: 2000, // How often to broadcast a hello packet in milliseconds.
        checkInterval: 4000, // How often to to check for missing nodes in milliseconds.
        nodeTimeout: 5000, // Consider a node dead if not seen in this many milliseconds.
        masterTimeout: 6000, // Consider a master node dead if not seen in this many milliseconds.
        monitor: false, // Skips key equality checks when logging.
        log: false, // If false, disables `helloLogsEnabled` and `statusLogsEnabled` no matter what value they have, and also own hello log.
        helloLogsEnabled: true, // Notifies when another service goes online.
        statusLogsEnabled: true, // Notifies when another service goes online or offline. If false, disables `helloLogsEnabled` as well.
        ignoreProcess: false, // Ignores messages from other services within the same process.
        environment: process.env.NODE_ENV, // Services will communicate only with services in the same environment
      };
      if (app.config.cache
        && app.config.cache.redis
        && app.config.cache.redis.host
        && app.config.cache.redis.port) {
        coteConfig.redis = {
          host: app.config.cache.redis.host,
        };
      }
      app.Cote = require('cote')(coteConfig);
      if (app.isApi) {
        app.requester = new app.Cote.Requester({
          name: app.name,
          key: process.env.NODE_ENV,
          namespace: app.config.service.api,
        });
      } else if (app.isService) {
        app.responder = new app.Cote.Responder({
          name: app.name,
          key: process.env.NODE_ENV,
          namespace: app.config.service.api,
        });
      }
    }
    return true;
  } catch (e) {
    console.log('loadCote', e);
    return false;
  }
}
module.exports = cote;
