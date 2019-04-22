const fs = require('fs');
const path = require('path');
const route = require('./base/route');

function init(service) {
  try {
    route.loadRoutes(service);
    return true;
  } catch (e) {
    return false;
  }
}

function Components(service) {
  const { scriptName, serviceName, servicePath } = service;
  try {
    init(service);
    // Loading service components
    const normalizedPath = path.join(process.cwd(), `${servicePath}/${scriptName}/`);
    const componentFolderExist = fs.existsSync(normalizedPath);
    if (componentFolderExist) {
      fs
        .readdirSync(normalizedPath)
        .forEach((componentName) => {
          const componentFolder = `${normalizedPath}/${componentName}/`;
          const isDir = fs.existsSync(componentFolder);
          if (isDir) {
            service.components[componentName] = {};
            // Load Controller
            service.components[componentName].controller = {};
            const controllerPath = `${componentFolder}controller.js`;
            const controllerFileExist = fs.existsSync(controllerPath);

            // Load Test Contracts
            service.components[componentName].test = {};
            const testPath = `${componentFolder}test.js`;
            const testFileExist = fs.existsSync(testPath);

            // Load router
            const routePath = `${componentFolder}route.js`;
            const routeFileExist = fs.existsSync(routePath);

            if (controllerFileExist
              && testFileExist
              && routeFileExist) {
              // Adding custom controllers
              service.components[componentName].controller = Object.assign(
                service.components[componentName].controller,
                require(`${controllerPath}`)(service),
              );

              // Adding custom tests
              service.components[componentName].test = Object.assign(
                service.components[componentName].test,
                require(`${testPath}`)(service),
              );

              require(`${routePath}`)(service.responder, service.components[componentName].controller);
            }
          }
        });
    }
    return true;
  } catch (e) {
    console.error(`${serviceName} ERROR LOADING_COMPONENTS`, e);
    service.apm(service, e);
    return false;
  }
}

module.exports = Components;
