function Controller(api, componentName) {
  const { db, config } = api;
  const controllers = {
    get: async (request, reply) => {
      let data = [];
      if (config.databases.postgres.softDelete
        && db[componentName].columns.includes('deleted')) {
        data = await db[componentName].find({ deleted: false }, request.pagination);
      } else {
        data = await db[componentName].find({}, request.pagination);
      }
      if (data.length === 0) return reply.status(204).send(data);
      return reply.status(200).send(data);
    },
    getById: async (request, reply) => {
      let data = null;
      if (config.databases.postgres.softDelete
        && db[componentName].columns.includes('deleted')) {
        data = await db[componentName].findOne({ id: request.params.id, deleted: false });
      } else {
        data = await db[componentName].findOne({ id: request.params.id });
      }
      if (!data) return reply.status(204).send(data);
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
      let data = {};
      if (config.databases.postgres.softDelete
        && db[componentName].columns.includes('deleted')) {
        data = await db[componentName].update(request.params.id, { deleted: true });
      } else {
        data = await db[componentName].destroy({ id: request.params.id });
      }
      return reply.status(201).send(data);
    },
  };
  return controllers;
}

module.exports = Controller;
