async function loadRoutes(responder, controller) {
  try {
    responder.on('health-check', controller.healthCheck);
    return true;
  } catch (e) {
    return false;
  }
}


module.exports = loadRoutes;
