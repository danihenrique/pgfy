function getRequiredFields(schema) {
  let body = {};
  if (schema && schema.properties) {
    body = {
      type: 'object',
      properties: {},
      required: [],
    };
    // eslint-disable-next-line guard-for-in
    for (const field in schema.properties) {
      const required = schema.required.includes(field);
      if (required && field !== 'id') {
        body.properties[field] = schema.properties[field];
        body.required.push(field);
      }
    }
  }
  return body;
}

module.exports = getRequiredFields;
