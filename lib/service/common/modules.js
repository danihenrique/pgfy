const fs = require('fs');

function Modules(service) {
  const { serviceName, servicePath } = service;
  try {
    // Loading modules required
    if (service.config.service.modules) {
      service.config.service.modules.forEach((_module) => {
        const modulePath = `${servicePath}/modules/${_module}/`;
        const moduleExist = fs.existsSync(modulePath);
        if (moduleExist) {
          service.spinner.text = `Loading module ${_module}...`;
          require('./common/components').extend(service, _module, modulePath);
        }
      });
    }
    return true;
  } catch (e) {
    console.error(`${serviceName} ERROR LOADING_MODULES`, e);
    service.apm(service, e);
    return false;
  }
}

module.exports = Modules;
