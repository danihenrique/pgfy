function fail(app, unit) {
  app.apm(app, new Error(unit));
  const messageEror = `Case: ${unit} failed!`;
  app.spinner.text = messageEror;
  console.error(messageEror);
  process.exit(0);
}

async function testAPI(app, controllers, cases, method) {
  try {
    // eslint-disable-next-line guard-for-in
    for (const unit in cases) {
      const test = cases[unit];
      const response = await controllers[method](test.request);
      const { status, message, data } = response;
      if (status !== test.status) {
        fail(app, unit);
      } else if (message !== test.message) {
        fail(app, unit);
      } else if (app.modules._.isEmpty(data) && !app.modules._.isEmpty(test.data)) {
        fail(app, unit);
      }
    }
  } catch (e) {
    fail(app, e.message);
  }
}

async function testService(app, controllers, cases, method) {
  try {
    // eslint-disable-next-line guard-for-in
    for (const unit in cases) {
      const test = cases[unit];
      controllers[method](test.req, (err, response) => {
        if (err !== test.error) {
          fail(app, unit);
        } else if (response !== test.response) {
          fail(app, unit);
        }
      });
    }
  } catch (e) {
    fail(app, e.message);
  }
}
async function contractTests(app, componentName, controller) {
  try {
    // Tests should run only in staging env
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'staging') {
      for (const method in controller) {
        if (method !== 'run') {
          if (app.components[componentName].test
            && app.components[componentName].test.contracts
            && app.components[componentName].test.contracts[method]) {
            app.spinner.text = `Testing ${componentName}->${method}....`;
            const cases = app.components[componentName].test.contracts[method]();
            if (app.isService) {
              await testService(app, controller, cases, method);
            } else {
              await testAPI(app, controller, cases, method);
            }
            app.spinner.succeed = `Testing ${componentName}->${method}->OK!`;
          }
        }
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}


module.exports = contractTests;
