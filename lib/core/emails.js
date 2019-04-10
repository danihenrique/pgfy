async function emails(app) {
  try {
    app.email = {};
    // SendGrid Email Support
    if (app.config.email
      && app.config.email.sendgrid
      && app.config.email.sendgrid.apiKey) {
      app.sendgrid = require('@sendgrid/mail');
      app.sendgrid.setApiKey(app.config.email.sendgrid.apiKey);
      app.email.sendgrid = {};
      app.email.sendgrid.sendTemplate = (to, data, templateId) => {
        const msg = {
          to,
          from: app.config.email.sendgrid.from,
          templateId,
          dynamic_template_data: data,
        };
        app.sendgrid.send(msg);
      };
      app.spinner.text = 'Loading Email SendGrid';
    }
    return true;
  } catch (e) {
    console.log('loadEmail', e);
    return false;
  }
}

module.exports = emails;


function emails() {

}
