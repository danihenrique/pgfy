/* eslint-disable max-len */
const path = require('path');

module.exports = {
  api: {
    name: process.env.PGFY_API_NAME || 'API',
    host: process.env.PGFY_API_HOST || '127.0.0.1',
    port: process.env.PGFY_API_PORT || 3000,
    componentsPath: process.env.PGFY_API_COMPONENTS_PATH || '/src/components',
    modules: ['health-check'],
  },
  service: {
    api: process.env.PGFY_API_NAME || 'API',
    servicePath: process.env.PGFY_SERVICE_PATH || '/src/services',
    modules: ['health-check'],
  },
  cote: {
    helloInterval: 2000, // How often to broadcast a hello packet in milliseconds.
    checkInterval: 4000, // How often to to check for missing nodes in milliseconds.
    nodeTimeout: 5000, // Consider a node dead if not seen in this many milliseconds.
    masterTimeout: 6000, // Consider a master node dead if not seen in this many milliseconds.
    monitor: false, // Skips key equality checks when logging.
    log: false, // If false, disables `helloLogsEnabled` and `statusLogsEnabled` no matter what value they have, and also own hello log.
    helloLogsEnabled: true, // Notifies when another service goes online.
    statusLogsEnabled: true, // Notifies when another service goes online or offline. If false, disables `helloLogsEnabled` as well.
    ignoreProcess: false, // Ignores messages from other services within the same process.
    environment: process.env.NODE_ENV, // Services will communicate only with services in the same environment
  },
  databases: {
    postgres: {
      host: process.env.PGFY_DATABASE_PG_HOST || '127.0.0.1',
      port: process.env.PGFY_DATABASE_PG_PORT || 5432,
      database: process.env.PGFY_DATABASE_PG_DATABASE || 'postgres',
      user: process.env.PGFY_DATABASE_PG_USER || 'postgres',
      password: process.env.PGFY_DATABASE_PG_PWS || '',
      softDelete: process.env.PGFY_DATABASE_PG_SOFTDELETE || false,
    },
    mongodb: {
      url: process.env.PGFY_DATABASE_MONGODB_URL,
      database: process.env.DATABASE_MONGODB_DATABASE,
    },
  },
  cache: {
    redis: {
      host: process.env.PGFY_CACHE_REDIS_HOST,
      port: process.env.PGFY_CACHE_REDIS_PORT,
      georedis: process.env.PGFY_CACHE_REDIS_GEOREDIS,
      expireTime: process.env.PGFY_CACHE_REDIS_EXPIRE_TIME || 1,
    },
  },
  email: {
    sendgrid: {
      apiKey: process.env.PGFY_EMAIL_SENDGRID_API_KEY,
      from: process.env.PGFY_EMAIL_SENDGRID_FROM,
    },
    nodemailer: {
      service: process.env.PGFY_EMAIL_NODEMAILER_SERVICE,
      to: process.env.PGFY_EMAIL_NODEMAILER_FROM,
      auth: {
        user: process.env.PGFY_EMAIL_NODEMAILER_USER,
        pass: process.env.PGFY_EMAIL_NODEMAILER_PASS,
      },
    },
  },
  apm: {
    sentry: {
      dsn: process.env.PGFY_APM_SENTRY_DSN,
    },
  },
  logger: {
    timber: {
      key: process.env.PGFY_LOGGER_TIMBER_KEY,
    },
  },
  payments: {
    gerencianet: {
      client_id: process.env.PGFY_PAYMENTS_GERENCIANET_CLIENT_ID,
      client_secret: process.env.PGFY_PAYMENTS_GERENCIANET_CLIENT_SECRET,
    },
  },
  uploaders: {
    storage: {
      memory: process.env.PGFY_UPLOAD_MEMORY_STORAGE || false,
    },
    s3: {
      accessKeyId: process.env.PGFY_AWS_ACCESS_KEY,
      secretAccessKey: process.env.PGFY_AWS_SECRET_ACCESS,
      thumbWidth: process.env.PGFY_AWS_S3_THUMB_WIDTH || 200,
    },
  },
  pushNotification: {
    apns: {
      keyFile: process.env.PGFY_PUSH_NOTIFICATION_APNS_KEY_PATH || path.join(process.cwd(), 'apns_key.pem'),
      certFile: process.env.PGFY_PUSH_NOTIFICATION_APNS_CERT_PATH || path.join(process.cwd(), 'apns_cert.pem'),
    },
    gcm: {
      apiKey: process.env.PGFY_PPUSH_NOTIFICATION_GCM_API_KEY || '',
    },
  },
  modules: [
    { variable: '_', name: 'lodash', options: {} },
    { variable: 'moment', name: 'moment', options: {} },
    { variable: 'bcrypt', name: 'bcryptjs', options: {} },
    { variable: 'nanoid', name: 'nanoid', options: {} },
    { variable: 'md5', name: 'md5-nodejs', options: {} },
    { variable: 'Collection', name: 'massive-collections', options: {} },
    { variable: 'GerenciaNet', name: 'gn-api-sdk-node', options: {} },
  ],
  plugins: [
    {
      name: 'fastify-rate-limit',
      options: {
        max: 100,
        timeWindow: '1 minute',
      },
    },
    {
      name: 'fastify-oas',
      options: {},
    },
    {
      name: 'fastify-helmet',
      options: {},
    },
    {
      name: 'fastify-multer',
      options: {},
    },
    {
      name: 'fastify-cors',
      options: {
        origin: '*',
      },
    },
    {
      name: 'fastify-tls-keygen',
      options: {
        key: process.env.PGFY_TLS_KEY_PATH || path.join(process.cwd(), 'api_key.pem'),
        cert: process.env.PGFY_TLS_CERT_PATH || path.join(process.cwd(), 'api_cert.pem'),
      },
      env: 'production',
    },
    {
      name: 'fastify-metrics',
      options: { endpoint: '/metrics' },
    },
    {
      name: 'fastify-session-sets',
      options: { secret: process.env.PGFY_AUTH_SESSION_SECRET },
    },
    {
      name: 'fastify-jwt',
      options: {
        secret: process.env.PGFY_AUTH_JWT_SECRET,
        expiresIn: process.env.PGFY_AUTH_JWT_EXPIRES_IN || '10h',
      },
    },
    {
      name: 'fastify-oauth2',
      options: {
        startRedirectPath: process.env.PGFY_OAUTH2_FACEBOOK_START_PATH || '/login/facebook',
        callbackUri: process.env.PGFY_OAUTH2_FACEBOOK_CALLBACK_URI || 'https://localhost:3000/login/facebook/callback',
      },
    },
  ],
  swagger: {
    routePrefix: process.env.PGFY_SWAGGER_ROUTE_PREFIX || '/documentation',
    addModels: true,
    exposeRoute: true,
    swagger: {
      info: {
        title: process.env.PGFY_SWAGGER_INFO_TITLE || 'Swagger UI',
        description: process.env.PGFY_SWAGGER_INFO_DESCRIPTION || 'Swagger UI - API Documentation',
        version: process.env.PGFY_SWAGGER_INFO_VERSION || '1.0.0',
      },
      host: process.env.PGFY_SWAGGER_HOST_PORT || `127.0.0.1:${process.env.PGFY_API_PORT || 3000}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'session-id',
        },
      },
    },
  },
};
