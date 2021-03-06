async function emails(app) {
  try {
    app.email = {};
    app.email.sendgrid = {};
    app.email.nodemailer = {};
    // SendGrid Email Support
    if (app.config.email
      && app.config.email.sendgrid
      && app.config.email.sendgrid.apiKey
      && app.config.email.sendgrid.from) {
      app.sendgrid = require('@sendgrid/mail');
      app.sendgrid.setApiKey(app.config.email.sendgrid.apiKey);
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
    } else {
      app.email.sendgrid.sendTemplate = async (params) => {
        throw new Error('You need to set the variables PGFY_EMAIL_SENDGRID_API_KEY and PGFY_EMAIL_SENDGRID_FROM to use SendGrid');
      };
    }
    // Nodemailer Email Support
    if (app.config.email
      && app.config.email.nodemailer
      && app.config.email.nodemailer.service
      && app.config.email.nodemailer.auth
      && app.config.email.nodemailer.auth.user
      && app.config.email.nodemailer.auth.pass) {
      app.nodemailer = require('nodemailer');
      const EmailTemplates = require('email-templates');
      const config = {
        service: app.config.email.nodemailer.service,
        auth: {
          user: app.config.email.nodemailer.auth.user,
          pass: app.config.email.nodemailer.auth.pass,
        },
      };
      app.nodemailerTransport = app.nodemailer.createTransport(config);
      app.emailTemplates = new EmailTemplates();
      app.email.nodemailer.sendTemplate = async (to, data, templateName) => {
        const templateRaw = await app.emailTemplates.renderAll(templateName, data);
        app.nodemailerTransport.sendMail({
          from: app.config.email.nodemailer.from,
          to,
          subject: templateRaw.subject,
          html: templateRaw.html,
          text: templateRaw.text,
        }, (err, responseStatus) => {
          if (err) {
            app.apm(app, err);
          }
          return responseStatus;
        });
      };
      app.spinner.text = 'Loading Email Nodemailer';
    } else {
      app.email.nodemailer.sendTemplate = async (params) => {
        throw new Error('You need to set the environment variables to use Nodemailer');
      };
    }
    return true;
  } catch (e) {
    console.log('loadEmail', e);
    return false;
  }
}

module.exports = emails;
