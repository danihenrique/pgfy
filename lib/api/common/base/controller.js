function Controller(api, componentName) {
  const { db, config, components } = api;
  const enableSoftDelete = config.databases.postgres.softDelete === 'true';
  const controllers = {
    get: async (request, reply) => {
      const { swagger } = components[componentName];
      const options = { ...request.pagination, fields: swagger.fields };
      let data = [];
      if (enableSoftDelete
        && db[componentName].columns.includes('deleted')) {
        data = await db[componentName].find({ deleted: false }, options);
      } else {
        data = await db[componentName].find({}, options);
      }
      if (data.length === 0) return reply.status(204).send(data);
      return reply.status(200).send(data);
    },
    getById: async (request, reply) => {
      const { swagger } = components[componentName];
      const options = { fields: swagger.fields };
      let data = null;
      if (enableSoftDelete
        && db[componentName].columns.includes('deleted')) {
        data = await db[componentName].findOne({ id: request.params.id, deleted: false }, options);
      } else {
        data = await db[componentName].findOne({ id: request.params.id }, options);
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
      if (enableSoftDelete
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
