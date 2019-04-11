const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');

function main(api, plugin) {
  const defaultLoginEndpoint = process.env.PGFY_AUTH_SESSION_LOGIN || '/login';
  api.register(fastifyCookie);
  api.register(fastifySession, plugin.options);
  api.addHook('preHandler', async (request, reply, next) => {
    const urlAllowed = request.req.originalUrl.split('/');
    if (urlAllowed.includes('v1')) {
      if (!request.session || !request.session.user) return reply.redirect(defaultLoginEndpoint);
    }
    return next();
  });
  return true;
}

module.exports = main;
