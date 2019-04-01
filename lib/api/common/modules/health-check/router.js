function Routes(api, componentName, swagger, controller) {
  try {
    api.get('/v1/health-check', swagger.get, controller.get);
    return true;
  } catch (e) {
    console.log(`Error loading routes for ${componentName}:`, e.message);
    return false;
  }
}

module.exports = Routes;
