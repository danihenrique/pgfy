function tests(service) {
  const contracts = {};
  /*
    PgFy will look for contracts for your Controllers.
    They need to have the same method name. E.g: controller.helloWorld()
    and contracts.helloWorld().
    Than you can add one or more test cases as the sample below.
    PgFy will check if the err and response are different as
    it should be passing the requests inputs you want to.
  */
  contracts.helloWorld = () => {
    const testCase = {};
    testCase['Hello-World-Test'] = {
      request: {
        body: {},
        query: {},
        params: {},
      },
      error: null,
      response: 'Hello World',
    };
    return testCase;
  };
  return { contracts };
}
module.exports = tests;
