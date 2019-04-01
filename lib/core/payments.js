async function payments(app) {
  try {
    // Timber logger
    if (app.config.payments
      && app.config.payments.gerencianet
      && app.config.payments.gerencianet.clientId
      && app.config.payments.gerencianet.clientSecret) {
      const { clientId, clientSecret } = app.config.payments.gerencianet;
      const options = {
        client_id: clientId,
        client_secret: clientSecret,
        sandbox: process.env.NODE_ENV !== 'production',
      };
      const GerenciaNet = require('gn-api-sdk-node');
      app.GerenciaNet = new GerenciaNet(options);
    }
    return true;
  } catch (e) {
    console.log('loadLogger', e);
    return false;
  }
}

module.exports = payments;
