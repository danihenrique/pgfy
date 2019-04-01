function Routes(api, componentName, swagger, controller) {
  try {
    api.get(`/v1/${componentName}/hello-world`, swagger.helloWorld, controller.helloWorld);
    return controller;
  } catch (e) {
    console.log(`Error loading routes for ${componentName}:`, e.message);
    return e.message;
  }
}

module.exports = Routes;
