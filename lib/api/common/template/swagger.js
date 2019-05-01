
function main(api, componentName, schema) {
  /*
    Fastify: Validation and Serialization document
    https://www.fastify.io/docs/latest/Validation-and-Serialization/
  */
  const swagger = {
    jsonSchema: schema,
    hideFields: [],
    helloWorld: {
      schema: {
        description: 'helloWorld',
        tags: [componentName],
        summary: componentName,
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
