function tests(api, componentName) {
  const contracts = {};
  contracts.helloWorld = () => {
    const testCase = {};
    testCase['Hello-World-Test'] = {
      request: {
        body: {},
        query: {},
        params: {},
      },
      status: 200,
      message: 'Hello World',
      data: {},
    };
    return testCase;
  };
  return { contracts };
}

module.exports = tests;
