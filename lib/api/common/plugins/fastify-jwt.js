function main(api, plugin) {
  if (api.config.cache
    && api.config.cache.redis
    && api.config.cache.redis.host
    && api.config.cache.redis.port) {
    api.register(require(plugin.name), plugin.options);
    api.addHook('onRequest', async (request, reply) => {
      try {
        const urlAllowed = request.req.originalUrl.split('/');
        if (urlAllowed.includes('v1')
          && !urlAllowed.includes('login')
          && !urlAllowed.includes('signup')) {
          const decoded = await request.jwtVerify();
          request.user = decoded;
        }
      } catch (err) {
        reply.send(err);
      }
    });
  } else {
    throw new Error('You must define your Redis configuration to use the Sessions.');
  }
  return true;
}

module.exports = main;
