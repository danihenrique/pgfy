

function controller(service) {
  const { db } = service;
  const controllers = {
    helloWorld: async (req, cb) => {
      try {
        return cb(null, 'Hello World');
      } catch (e) {
        return cb(e.message, false);
      }
    },
  };
  return controllers;
}

module.exports = controller;
