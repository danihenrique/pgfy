function generateCrud(api) {
  try {
    const BASE_PATH = './base';
    api.components = {};
    if (api.db.objects) {
      api.db.objects.forEach((table) => {
        const schema = api.schemas.find(item => item.title.toLowerCase() === table.name);
        const swagger = require(`${BASE_PATH}/swagger`)(api, table.name, schema);
        const controller = require(`${BASE_PATH}/controller`)(api, table.name);
        const test = require(`${BASE_PATH}/test`)(api, table.name);
        require(`${BASE_PATH}/router`)(api, table.name, swagger, controller);
        api.components[table.name] = {};
        api.components[table.name].swagger = swagger;
        api.components[table.name].controller = controller;
        api.components[table.name].test = test;
        api.components[table.name].models = new api.modules.Collection(table.name, api.db);
        api.spinner.text = `Loading table ${table.name}`;
      });
    }
    return true;
  } catch (e) {
    console.log('Error loading base table', e.message);
  }
  return api;
}

module.exports = generateCrud;
