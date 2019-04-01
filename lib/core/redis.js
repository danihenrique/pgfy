async function redis(app) {
  try {
    if (app.config.cache
      && app.config.cache.redis
      && app.config.cache.redis.host
      && app.config.cache.redis.port) {
      const Redis = require('redis');
      app.spinner.text = 'Loading Redis Database...';
      app.redis = Redis.createClient({
        host: app.config.cache.redis.host,
        port: app.config.cache.redis.port,
      });

      // Geo Redis Addon
      if (app.config.cache.redis.georedis) {
        app.spinner.text = 'Loading Redis Geolocation Addon...';
        app.geo = require('georedis').initialize(app.redis);
      }
    }
    return true;
  } catch (e) {
    console.log('loadRedis', e);
    return false;
  }
}

module.exports = redis;
