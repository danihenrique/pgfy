async function core(app) {
  try {
    app.apm = require('./apm').apm;
    // Load APM
    const apmLoaded = await require('./apm').load(app);
    if (!apmLoaded) throw new Error('APM Error');
    // Load Service Requester
    const serviceRequesterLoaded = await require('./cote')(app);
    if (!serviceRequesterLoaded) throw new Error('Cote Error');
    // Load Postgres
    const postgresLoaded = await require('./postgres')(app);
    if (!postgresLoaded) throw new Error('Postgres Error');
    // Load MongoDB
    const mongodbLoaded = await require('./mongodb')(app);
    if (!mongodbLoaded) throw new Error('MongoDB Error');
    // Load Redis
    const redisLoaded = await require('./redis')(app);
    if (!redisLoaded) throw new Error('Redis Error');
    // Load Logger
    const loggerLoaded = await require('./logger')(app);
    if (!loggerLoaded) throw new Error('Logger Error');
    // Load Upload S3 Bucket
    const uploadToS3Loaded = await require('./uploadToS3')(app);
    if (!uploadToS3Loaded) throw new Error('UploadToS3 Error');
    // Load Emails
    const emailsLoaded = await require('./emails')(app);
    if (!emailsLoaded) throw new Error('Logger Emails');
    return true;
  } catch (e) {
    app.apm(app, e);
    console.log(e);
    process.exit(0);
    return false;
  }
}

module.exports = core;
