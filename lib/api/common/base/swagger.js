
function main(api, componentName, schema) {
  const base = {
    schema: {
      description: componentName,
      tags: ['Auto generated'],
      summary: componentName,
      security: [
        {
          Bearer: [],
        },
      ],
    },
  };
  const swagger = {};
  const querystring = {
    type: 'object',
    properties: {
      offset: { type: 'string' },
      limit: { type: 'number' },
    },
  };

  // GET
  swagger._get = api.modules._.cloneDeep(base);
  swagger._get.schema.querystring = api.modules._.cloneDeep(querystring);

  // GetById
  swagger._getById = api.modules._.cloneDeep(swagger._get);
  swagger._getById.schema.params = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  };

  // PUT
  swagger._put = api.modules._.cloneDeep(base);
  swagger._put.schema.params = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  };
  swagger._put.schema.body = api.getRequiredFields(schema);

  // POST
  swagger._post = api.modules._.cloneDeep(base);
  swagger._post.schema.body = api.getRequiredFields(schema);

  // DELETE
  swagger._delete = api.modules._.cloneDeep(base);
  swagger._delete.schema.params = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
  };
  return swagger;
}

module.exports = main;
