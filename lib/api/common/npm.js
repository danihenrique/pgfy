
function npm(api) {
  try {
    api.modules = {};
    const modulesRequired = [
      {
        variable: 'response', name: './utils/apiResponse.js', options: {}, root: true,
      },
      {
        variable: 'getRequiredFields', name: './utils/getRequiredFields.js', options: {}, root: true,
      }
    ];
    if (!api.config.modules) api.config.modules = [];
    api.config.modules = api.config.modules.concat(modulesRequired);
    api.config.modules.forEach((_module) => {
      api.spinner.text = `Loading module ${_module.name}`;
      // TODO: Install the npm module before require it.
      const moduleLoaded = Object.keys(_module.options).length === 0
        ? require(_module.name) : require(_module.name)(_module.options);
      // api.decorate(_module.variable, moduleLoaded);
      if (_module.root) {
        api[_module.variable] = moduleLoaded;
      } else {
        api.modules[_module.variable] = moduleLoaded;
      }
    });
    return true;
  } catch (e) {
    console.log('Error Loading module: ', e.message);
    return false;
  }
}

module.exports = npm;
