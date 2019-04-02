
async function npm(api) {
  try {
    api.modules = {};
    if (!api.config.modules) api.config.modules = [];
    for (const _module of api.config.modules) {
      api.spinner.text = `Loading module ${_module.name}`;
      await api.pluginManager.install(_module.name);
      const moduleLoaded = Object.keys(_module.options).length === 0
        ? api.pluginManager.require(_module.name)
        : api.pluginManager.require(_module.name)(_module.options);
      api.modules[_module.variable] = moduleLoaded;
    }
    return true;
  } catch (e) {
    console.log('Error Loading module: ', e.message);
    return false;
  }
}

module.exports = npm;
