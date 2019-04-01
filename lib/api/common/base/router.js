function Routes(api, componentName, swagger, controller) {
  try {
    api.get(`/v1/${componentName}`, swagger._get, controller.get);
    api.get(`/v1/${componentName}/:id`, swagger._getById, controller.getById);
    api.put(`/v1/${componentName}/:id`, swagger._put, controller.put);
    api.post(`/v1/${componentName}`, swagger._post, controller.post);
    api.delete(`/v1/${componentName}/:id`, swagger._delete, controller.delete);
    return controller;
  } catch (e) {
    console.log(`Error loading routes for ${componentName}:`, e.message);
    return e.message;
  }
}

module.exports = Routes;
