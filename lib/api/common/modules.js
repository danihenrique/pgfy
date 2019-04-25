function Modules(api) {
  try {
    // Load modules
    if (api.config.api.modules) {
      if (process.env.PGFY_FACEBOOK_CLIENT_ID
          && process.env.PGFY_FACEBOOK_CLIENT_SECRET) {
        api.config.api.modules.push('facebook-auth');
      }
      const MODULES_PATH = './modules/';
      api.config.api.modules.forEach((_module) => {
        if (!api.components[_module]) api.components[_module] = {};
        const schema = api.schemas.find(item => item.title.toLowerCase() === _module);
        // Load Swagger
        const swagger = require(`${MODULES_PATH}${_module}/swagger`)(
          api,
          _module,
          schema,
        );
        // Load Controller
        const controller = require(`${MODULES_PATH}${_module}/controller`)(
          api,
          _module,
        );
        // Load Test Contracts
        const test = require(`${MODULES_PATH}${_module}/test`)(
          api,
          _module,
        );
        // Load router
        api.components[_module].router = require(`${MODULES_PATH}${_module}/router`);
        api.components[_module].swagger = swagger;
        api.components[_module].controller = controller;
        api.components[_module].test = test;
        api.components[_module].models = new api.modules.Collection(_module, api.db);
        api.spinner.text = `Loading built-in module ${_module}`;
      });
    }
    return true;
  } catch (e) {
    console.log('Error loading components: ', e.message);
    return false;
  }
}

module.exports = Modules;
