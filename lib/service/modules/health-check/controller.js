function controller(service) {
  const { redis } = service;
  const controllers = {
    healthCheck: async (req, cb) => {
      try {
        // TODO: Check connections
        return cb(null, 'Health-Check-OK');
      } catch (e) {
        return cb(e.message, false);
      }
    },
  };
  return controllers;
}

module.exports = controller;
