const fs = require('fs');
const path = require('path');
const { merge } = require('../../utils');

function Components(api) {
  try {
    const { _ } = api.modules;
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
              const swaggerOriginalHideFields = _.cloneDeep(api.components[component].swagger.hideFields);
              const swaggerCustomHideFields = _.cloneDeep(swagger.hideFields);
              delete swagger.hideFields;
              // Merge the original and the custom hideFields Array
              api.components[component].swagger.hideFields = _.concat(
                swaggerOriginalHideFields,
                swaggerCustomHideFields,
              );
              api.components[component].swagger = {
                ...api.components[component].swagger,
                ...swagger,
              };
            } else {
              api.components[component].swagger = swagger;
            }
            // eslint-disable-next-line max-len
            api.components[component].swagger.fields = [];
            if (Array.isArray(api.components[component].swagger.allFields)
              && Array.isArray(api.components[component].swagger.hideFields)) {
              api.components[component].swagger.fields = api.components[component].swagger.allFields.filter(field => !api.components[component].swagger.hideFields.includes(field));
            }

            if (api.components[component].controller) {
              api.components[component].controller = {
                ...api.components[component].controller,
                ...controller,
              };
            } else {
              api.components[component].controller = controller;
            }

            if (api.components[component].test) {
              api.components[component].test = {
                ...api.components[component].test,
                ...test,
              };
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
