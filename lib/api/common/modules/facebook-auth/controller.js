
function Controller(api, componentName) {
  const controllers = {
    auth: async (request, reply) => {
      // This will be called by Facebook as a callback handler
      const result = await api.getAccessTokenFromAuthorizationCodeFlow(request);
      if (!result) {
        return reply.send(result);
      }
      return reply.send(result.access_token);
    },
  };
  return controllers;
}

module.exports = Controller;
