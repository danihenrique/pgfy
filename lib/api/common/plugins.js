function plugins(api) {
  try {
    if (api.config.plugins) {
      api.config.plugins.forEach((plugin) => {
        let useGenericRegister = true;
        api.spinner.text = `Loading plugin ${plugin.name}`;
        if (plugin.name === 'fastify-oas') {
          plugin.options = api.config.swagger;
        } else if (plugin.name === 'fastify-oauth2') {
          useGenericRegister = false;
          if (process.env.PGFY_FACEBOOK_CLIENT_ID && process.env.PGFY_FACEBOOK_CLIENT_SECRET) {
            useGenericRegister = true;
            require('./plugins/fastify-oauth2')(api, plugin);
          }
        } else if (plugin.name === 'fastify-session-sets') {
          useGenericRegister = false;
          if (process.env.PGFY_AUTH_SESSION_SECRET) {
            require('./plugins/fastify-session-sets')(api, plugin);
          }
        } else if (plugin.name === 'fastify-jwt') {
          useGenericRegister = false;
          if (process.env.PGFY_AUTH_JWT_SECRET) {
            require('./plugins/fastify-jwt')(api, plugin);
          }
        } else if (plugin.name === 'fastify-multer') {
          useGenericRegister = false;
          require('./plugins/fastify-multer')(api, plugin);
        }
        if (!plugin.env && useGenericRegister) {
          api.register(require(plugin.name), plugin.options);
        } else if (plugin.env === process.env.NODE_ENV && useGenericRegister) {
          api.register(require(plugin.name), plugin.options);
        }
      });
    }
    return true;
  } catch (e) {
    console.log('Error Loading plugin: ', e.message);
    return false;
  }
}

module.exports = plugins;
