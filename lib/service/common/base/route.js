
function coteLogger(req, cb) {
  let message = '';
  if (req.type !== undefined) {
    message += `Type->${JSON.stringify(req.type)}`;
  }
  if (req.body !== undefined) {
    message += `Body->${JSON.stringify(req.body)}`;
  }
  if (req.params !== undefined) {
    message += `Params->${JSON.stringify(req.params)}`;
  }
  if (req.query !== undefined) {
    message += `Query->${JSON.stringify(req.query)}`;
  }
  if (message !== '') console.log('Cote-Responder | ', message);
}

function loadRoutes(service) {
  try {
    service.components.base = {};
    service.components.base.controller = {};
    service.components.base.controller = require('./controller')(service);
    service.responder.on('*', coteLogger);
    return true;
  } catch (e) {
    return false;
  }
}


module.exports = { loadRoutes };
