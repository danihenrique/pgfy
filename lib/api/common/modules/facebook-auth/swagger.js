
function main(api, componentName) {
  const swagger = {
    auth: {
      schema: {
        description: 'OAuth 2.0 Facebook',
        tags: ['default'],
        summary: 'OAuth 2.0 Facebook',
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
