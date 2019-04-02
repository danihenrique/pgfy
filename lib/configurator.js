
module.exports = {
  api: {
    name: process.env.PGFY_API_NAME || 'API',
    host: process.env.PGFY_API_HOST || '127.0.0.1',
    port: process.env.PGFY_API_PORT || 3000,
    componentsPath: process.env.PGFY_API_COMPONENTS_PATH || '/src/components',
    modules: ['health-check', 'facebook-auth'],
  },
  service: {
    api: process.env.PGFY_API_NAME || 'API',
    servicePath: process.env.PGFY_SERVICE_PATH || '/src/services',
    modules: ['health-check'],
  },
  databases: {
    postgres: {
      host: process.env.PGFY_DATABASE_PG_HOST || '127.0.0.1',
      port: process.env.PGFY_DATABASE_PG_PORT || 5432,
      database: process.env.PGFY_DATABASE_PG_DATABASE || 'postgres',
      user: process.env.PGFY_DATABASE_PG_USER || 'postgres',
      password: process.env.PGFY_DATABASE_PG_PWS || '',
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
  pushNotification: {
    apns: {
      keyFile: process.env.PGFY_PUSH_NOTIFICATION_APNS_KEY_PATH || '../../key.pem',
      certFile: process.env.PGFY_PUSH_NOTIFICATION_APNS_CERT_PATH || '../../cert.pem',
    },
    gcm: {
      apiKey: process.env.PGFY_PPUSH_NOTIFICATION_GCM_API_KEY || '',
    },
  },
  modules: [
    { variable: '_', name: 'lodash', options: {} },
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
      name: 'fastify-cors',
      options: {
        origin: '*',
      },
    },
    {
      name: 'fastify-tls-keygen',
      options: {
        key: process.env.PGFY_TLS_KEY_PATH || '../../server.key',
        cert: process.env.PGFY_TLS_CERT_PATH || '../../server.cert',
      },
      env: 'production',
    },
    {
      name: 'fastify-metrics',
      options: { endpoint: '/metrics' },
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
      host: process.env.PGFY_SWAGGER_HOST_PORT || '127.0.0.1:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
      },
    },
  },
};
