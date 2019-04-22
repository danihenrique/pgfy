const fs = require('fs');
const path = require('path');

function Components(api) {
  api.components = {};
  try {
    const normalizedPath = path.join(process.cwd(), api.config.api.componentsPath);
    const componentFolderExist = fs.existsSync(normalizedPath);
    if (componentFolderExist) {
      fs
        .readdirSync(normalizedPath)
        .forEach(async (component) => {
          api.components[component] = {};
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

            require(routePath)(
              api,
              component,
              swagger,
              controller,
            );

            api.components[component].swagger = swagger;
            api.components[component].controller = controller;
            api.components[component].test = test;
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
