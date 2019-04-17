
function main(api, plugin) {
  if (api.config.cache
    && api.config.cache.redis
    && api.config.cache.redis.host
    && api.config.cache.redis.port) {
    const FastifySession = require(plugin.name).default;
    const Redis = require('ioredis');

    api.register(require('fastify-cookie')).register(FastifySession, {
      client: new Redis(Number(api.config.cache.redis.port), api.config.cache.redis.host),
      maxAge: process.env.PGFY_AUTH_SESSION_MAX_AGE || '28 days',
      references: {
        user_id: {},
      },
    });
    api.addHook('preValidation', async (request, reply) => {
      // Fix to work with Swagger-UI with cookie in header
      if (request.headers['session-id']) {
        if (!request.cookies['session-id']) {
          request.cookies = {
            'session-id': request.headers['session-id'],
          };
        }
        if (!request.headers.cookie) {
          request.headers.cookie = `session-id=${request.headers['session-id']}`;
        }
      }
    });

    api.addHook('preHandler', async (request, reply, next) => {
      const urlAllowed = request.req.originalUrl.split('/');
      if (urlAllowed.includes('v1')
        && !urlAllowed.includes('login')
        && !urlAllowed.includes('signup')) {
        const session = await request.session.get();
        if (!session.user_id) {
          reply.status(401);
          return reply.send('User session not found!');
        }
      }
      return true;
    });
  } else {
    throw new Error('You must define your Redis configuration to use the Sessions.');
  }
  return true;
}

module.exports = main;
