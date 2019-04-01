async function healthCheck(req, cb) {
  try {
    // TODO: Check connections
    return cb(null, true);
  } catch (e) {
    return cb(e.message, false);
  }
}

function controller(service) {
  this.service = service;
  this.logger = service.logger;
  return {
    healthCheck,
  };
}

module.exports = controller;
