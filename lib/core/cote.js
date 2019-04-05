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

function cote(app) {
  try {
    // Cote Service
    if (app.config.service) {
      app.spinner.text = 'Loading Cote Micro service framework...';
      if (app.config.cache
        && app.config.cache.redis
        && app.config.cache.redis.host
        && app.config.cache.redis.port) {
        app.config.cote.redis = {
          host: app.config.cache.redis.host,
        };
      }
      app.Cote = require('cote')(app.config.cote);
      if (app.isApi) {
        app.requester = new app.Cote.Requester({
          name: app.name,
          namespace: app.config.service.api,
        });
      } else if (app.isService) {
        app.responder = new app.Cote.Responder({
          name: app.name,
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
