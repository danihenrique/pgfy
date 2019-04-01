function Controller(api, componentName) {
  const { db } = api;
  const controllers = {
    helloWorld: async (request, reply) => {
      api.response(reply, 200, 'Hello World', {});
    },
  };
  return controllers;
}

module.exports = Controller;
