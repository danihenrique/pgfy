
async function requireUtils(api) {
  try {
    if (!api.modules) api.modules = {};
    const modulesRequired = [
      {
        variable: 'response', name: './utils/apiResponse.js', options: {}, root: true,
      },
      {
        variable: 'getRequiredFields', name: './utils/getRequiredFields.js', options: {}, root: true,
      },
      {
        variable: 'fileExtension', name: './utils/fileExtension.js', options: {}, root: false,
      },
      {
        variable: 'isBase64', name: './utils/isBase64.js', options: {}, root: false,
      },
    ];
    modulesRequired.forEach((_module) => {
      api.spinner.text = `Loading module ${_module.name}`;
      const moduleLoaded = Object.keys(_module.options).length === 0
        ? require(_module.name) : require(_module.name)(_module.options);
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

module.exports = requireUtils;
