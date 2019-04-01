
async function loadRoutes(responder, controller) {
  try {
    responder.on('hello', controller.helloWorld);
    return true;
  } catch (e) {
    return false;
  }
}


module.exports = loadRoutes;
