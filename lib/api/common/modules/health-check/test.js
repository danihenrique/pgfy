const contracts = {};

contracts.get = () => {
  const testCase = {};
  testCase.healthCheck = {
    request: {
      body: {},
    },
    status: 200,
    message: 'Health-Check',
    data: {},
  };
  return testCase;
};

function tests(api, componentName) {
  return { contracts };
}
module.exports = tests;
