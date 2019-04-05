async function redis(app) {
  function connect(config) {
    const Redis = require('redis');
    const bluebird = require('bluebird');
    bluebird.promisifyAll(Redis.RedisClient.prototype);
    bluebird.promisifyAll(Redis.Multi.prototype);
    app.redisClient = Redis.createClient(config);
    app.redisClient.on('error', (err) => {
      throw new Error('Error connecting to Redis client.');
    });
    return app.redisClient;
  }

  function formatQuery(query) {
    let queryFormated;
    if (typeof query === 'object') {
      queryFormated = JSON.stringify(query);
    } else {
      queryFormated = String(query);
    }
    return queryFormated;
  }

  async function get(query) {
    try {
      const queryFormated = formatQuery(query);
      const results = await app.redisClient.getAsync(queryFormated);
      return JSON.parse(results);
    } catch (e) {
      return false;
    }
  }

  async function set(query, data, expire = app.config.cache.redis.expireTime) {
    try {
      const queryFormated = formatQuery(query);
      const results = await app.redisClient.set(queryFormated, JSON.stringify(data), 'EX', 60 * expire);
      return results;
    } catch (e) {
      return false;
    }
  }

  const redisWrap = {
    get,
    set,
  };

  try {
    if (app.config.cache
      && app.config.cache.redis
      && app.config.cache.redis.host
      && app.config.cache.redis.port) {
      app.spinner.text = 'Loading Redis Database...';
      connect({
        host: app.config.cache.redis.host,
        port: app.config.cache.redis.port,
      });
      app.redis = redisWrap;

      // Geo Redis Addon
      if (app.config.cache.redis.georedis) {
        app.spinner.text = 'Loading Redis Geolocation Addon...';
        app.geo = require('georedis').initialize(app.redisClient);
      }
    }
    return true;
  } catch (e) {
    console.log('loadRedis', e);
    return false;
  }
}

module.exports = redis;
