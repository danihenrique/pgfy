
function connect(app, MongoClient) {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the Server
    MongoClient.connect(app.config.databases.mongodb.url,
      { useNewUrlParser: true },
      (err, mongoDB) => {
        if (err) reject(err);
        app.mongodb = mongoDB.db(app.config.databases.mongodb.database);
        mongoDB.close();
        resolve(true);
      });
  });
}

async function mongodb(app) {
  try {
    // MongoDB
    if (app.config.databases
      && app.config.databases.mongodb
      && app.config.databases.mongodb.url
      && app.config.databases.mongodb.database) {
      app.MongoClient = require('mongodb').MongoClient;
      const connection = await connect(app, app.MongoClient);
      app.spinner.text = 'Loading MongoDB...';
      return connection;
    }
    return true;
  } catch (e) {
    console.log('loadMongodb', e);
    return false;
  }
}

module.exports = mongodb;
