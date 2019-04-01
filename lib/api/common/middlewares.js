function middlewares(api) {
  try {
    if (api.config.middlewares) {
      // Load all middlewares
      api.config.middlewares.forEach((middleware) => {
        api.use(require(middleware.name)());
        api.spinner.text = `Loading middleware ${middleware.name}`;
      });
      // Parse pagination options
      api.addHook('preHandler', (request, reply, next) => {
        const offset = request.query.offset ? Number(request.query.offset) : 0;
        const limit = request.query.limit ? Number(request.query.limit) : 1;
        request.pagination = {
          offset,
          limit,
        };
        next();
      });
    }
    return true;
  } catch (e) {
    console.log('Error Loading middleware: ', e.message);
    return e.message;
  }
}

module.exports = middlewares;
