function main(api, plugin) {
  api.register(require(plugin.name), plugin.options);
  api.addHook('onRequest', async (request, reply) => {
    try {
      const urlAllowed = request.req.originalUrl.split('/');
      if (urlAllowed.includes('v1')
        && !urlAllowed.includes('login')
        && !urlAllowed.includes('signup')
        && !urlAllowed.includes('health-check')) {
        const decoded = await request.jwtVerify();
        request.user = decoded;
      }
    } catch (err) {
      reply.send(err);
    }
  });
  return true;
}

module.exports = main;
