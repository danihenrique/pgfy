
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
          },
        ],
      },
    },
  };
  return swagger;
}

module.exports = main;
