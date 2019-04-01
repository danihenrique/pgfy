function Controller(api, componentName) {
  const controllers = {
    get: async (request, reply) => api.response(reply, 200, 'Health-Check', {}),
  };
  return controllers;
}

module.exports = Controller;
