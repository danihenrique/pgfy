const test = require('ava');

(async () => {
  try {
    const { Api } = require('../lib');
    // WIP
    test('Add a valid NPM module', async (t) => {
      const app = await Api({
        modules: [
          { variable: 'lodash', name: 'lodash', options: {} },
        ],
      });
      if (app.modules.lodash) {
        t.pass('NPM module loaded...');
      } else {
        t.fail('NPM module not loaded...');
      }
    });
  } catch (e) {
    console.log('Error loading App: ', e);
  }
})();
