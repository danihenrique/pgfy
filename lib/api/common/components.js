const fs = require('fs');
const path = require('path');
const { merge } = require('../../utils');

function Components(api) {
  try {
    const normalizedPath = path.join(process.cwd(), api.config.api.componentsPath);
    const componentFolderExist = fs.existsSync(normalizedPath);
    if (componentFolderExist) {
      fs
        .readdirSync(normalizedPath)
        .forEach(async (component) => {
          const schema = api.schemas.find(item => item.title.toLowerCase() === component);
          // Load Swagger
          const swaggerPath = `${normalizedPath}/${component}/swagger.js`;
          const swaggerFileExist = fs.existsSync(swaggerPath);

          // Load Controller
          const controllerPath = `${normalizedPath}/${component}/controller.js`;
          const controllerFileExist = fs.existsSync(controllerPath);

          // Load Test Contracts
          const testPath = `${normalizedPath}/${component}/test.js`;
          const testFileExist = fs.existsSync(controllerPath);

          // Load router
          const routePath = `${normalizedPath}/${component}/router.js`;
          const routeFileExist = fs.existsSync(controllerPath);

          if (swaggerFileExist
            && controllerFileExist
            && testFileExist
            && routeFileExist) {
            const swagger = require(swaggerPath)(
              api,
              component,
              schema,
            );

            const controller = require(controllerPath)(
              api,
              component,
            );

            const test = require(testPath)(
              api,
              component,
            );

            if (!api.components[component]) api.components[component] = {};
            api.components[component].router = require(routePath);

            if (api.components[component].swagger) {
              api.components[component].swagger = merge(api.components[component].swagger, swagger);
            } else {
              api.components[component].swagger = swagger;
            }
            // eslint-disable-next-line max-len
            api.components[component].swagger.fields = api.components[component].swagger.allFields.filter(field => !api.components[component].swagger.blacklist.includes(field));

            if (api.components[component].controller) {
              api.components[component].controller = {
                ...controller,
                ...api.components[component].controller,
              };
            } else {
              api.components[component].controller = controller;
            }

            if (api.components[component].test) {
              api.components[component].test = { ...test, ...api.components[component].test };
            } else {
              api.components[component].test = test;
            }
            api.components[component].models = new api.modules.Collection(component, api.db);
            api.spinner.text = `Loading component ${component}`;
          }
        });
    }
    return true;
  } catch (e) {
    console.log('Error loading components: ', e.message);
    return false;
  }
}

module.exports = Components;
