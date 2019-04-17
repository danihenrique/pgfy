
function main(api, componentName) {
  const swagger = {
    get: {
      schema: {
        description: componentName,
        tags: [componentName],
        summary: componentName,
        security: [
          {
            Bearer: [],
            cookieAuth: [],
          },
        ],
      },
    },
  };
  return swagger;
}

module.exports = main;
