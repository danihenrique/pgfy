function Controller(api, componentName) {
  const { db } = api;
  const controllers = {
    get: async (request, reply) => {
      const data = await db[componentName].find({}, request.pagination);
      return api.response(reply, 200, componentName, data);
    },
    getById: async (request, reply) => {
      const data = await db[componentName].findOne({ id: request.params.id });
      if (!data) return api.response(reply, 404, componentName, {});
      return api.response(reply, 200, componentName, data);
    },
    put: async (request, reply) => {
      const data = await db[componentName].update(request.params.id, request.body);
      return api.response(reply, 201, componentName, data);
    },
    post: async (request, reply) => {
      const data = await db[componentName].save(request.body);
      return api.response(reply, 201, componentName, data);
    },
    delete: async (request, reply) => {
      const data = await db[componentName].destroy({ id: request.params.id });
      return api.response(reply, 201, componentName, data);
    },
  };
  return controllers;
}

module.exports = Controller;
