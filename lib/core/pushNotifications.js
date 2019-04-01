const apns = require('apns');
const gcm = require('node-gcm');

function pushNotifications(app) {
  try {
    app.notify = {};
    if (app.config.pushNotification && app.config.pushNotification.apns) {
      const optionsForApns = {
        keyFile: app.config.pushNotification.apns.keyFile,
        certFile: app.config.pushNotification.apns.certFile,
        debug: process.env.NODE_ENV === 'development',
        gateway: process.env.NODE_ENV === 'development' ? 'gateway.sandbox.push.apple.com' : 'gateway.sandbox.push.apple.com',
        errorCallback(num, err) {
          console.error(err);
        },
      };

      const sendIos = (deviceId, message) => {
        const connection = new apns.Connection(optionsForApns);
        const notification = new apns.Notification();
        notification.device = new apns.Device(deviceId);
        notification.alert = message;
        connection.sendNotification(notification);
      };
      app.notify.sendIos = sendIos;
    }

    if (app.config.pushNotification && app.config.pushNotification.gcm) {
      const sendAndroid = (devices, message) => {
        const data = new gcm.Message({
          notification: {
            title: message,
          },
        });
        // eslint-disable-next-line new-cap
        const sender = new gcm.sender(app.config.pushNotification.gcm.apiKey);
        sender.send(data, {
          registrationTokens: devices,
        });
      };
      app.notify.sendAndroid = sendAndroid;
    }
    return true;
  } catch (e) {
    console.log('Error Push Notification: ', e.message);
    return false;
  }
}

module.exports = pushNotifications;
