function Routes(api, componentName, swagger, controller) {
  try {
    api.get('/login/facebook/callback', swagger.auth, controller.auth);
    return true;
  } catch (e) {
    console.log(`Error loading routes for ${componentName}:`, e.message);
    return false;
  }
}

module.exports = Routes;
