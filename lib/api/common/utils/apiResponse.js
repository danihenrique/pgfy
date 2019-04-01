const apiResponse = (reply, status = 200, message = 'ok', data = []) => {
  const ret = {
    message,
    data,
  };
  if (reply && reply.type) {
    reply.type('application/json').code(status);
    return reply.send(ret);
  }
  ret.status = status;
  return ret;
};

module.exports = apiResponse;
