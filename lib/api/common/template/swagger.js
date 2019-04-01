
function main(api, componentName) {
  /*
    Fastify: Validation and Serialization document
    https://www.fastify.io/docs/latest/Validation-and-Serialization/
  */
  const swagger = {
    helloWorld: {
      schema: {
        description: 'helloWorld',
        tags: [componentName],
        summary: componentName,
        querystring: {
          type: 'object',
          properties: {
            offset: { type: 'string' },
            limit: { type: 'number' },
          },
        },
        params: {},
        body: {},
        security: [
          {
            Bearer: [],
          },
        ],
      },
    },
  };
  return swagger;
}

module.exports = main;
