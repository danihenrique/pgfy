function Controller(api, componentName) {
  const { db } = api;
  const controllers = {
    get: async (request, reply) => {
      const data = await db[componentName].find({}, request.pagination);
      return reply.status(200).send(data);
    },
    getById: async (request, reply) => {
      const data = await db[componentName].findOne({ id: request.params.id });
      if (!data) return api.response(reply, 404, componentName, {});
      return reply.status(200).send(data);
    },
    put: async (request, reply) => {
      const data = await db[componentName].update(request.params.id, request.body);
      return reply.status(201).send(data);
    },
    post: async (request, reply) => {
      const data = await db[componentName].save(request.body);
      return reply.status(201).send(data);
    },
    delete: async (request, reply) => {
      const data = await db[componentName].destroy({ id: request.params.id });
      return reply.status(201).send(data);
    },
  };
  return controllers;
}

module.exports = Controller;
