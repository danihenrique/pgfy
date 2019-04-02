![PgFy](https://github.com/danihenrique/pgfy/blob/master/pgfy.png?raw=true) BETA

PgFy — A Node.js Toolbox for API and Micro-service development with MassiveJS + Fastify + CoteJS.

***** WORK-IN-PROGRESS !!! *****

[![NPM version](https://badge.fury.io/js/pgfy.png)](http://badge.fury.io/js/pgfy)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/danihenrique/pgfy/blob/master/LICENSE)

**PgFy automatically generate the CRUD endpoints for your Postgres database. Allowing you easily extend it using components pattern**.

![Auto-generate](https://github.com/danihenrique/pgfy/blob/master/sample.png?raw=true)

## Features
- **Auto-generate:** Automatically generate the endpoints for your database;
- **Pre-configured:** Fastify came pre-configured with some the best plugins available;
- **Extensible:** Easily extend your API using "Components pattern";
- **Micro-service support:** Easily extend your application using "Microservice pattern";
- **Auto-Documentation:** Access all your API endpoints available using Swagger UI.

## Table of Contents
1. [Motivation](#motivation)
1. [Getting started](#getting-started)
    1. [Installation](#installation)
    1. [Using pgfy for the first time](#using-pgfy-for-the-first-time)
1. [Controlling PgFy with environment variables](#controlling-pgfy-with-environment-variables)    
1. [Tools built-in](#tools-built-in)
    1. [API's with Fastify](#apis-with-fastify)
    1. [Postgres database with MassiveJS](#postgres-database-with-massivejs)
    1. [Micro-services with CoteJS](#micro-services-with-cotejs)
1. [Advanced Usage](#advanced-usage)
    1. [CLI](#cli)
    1. [How to extend the API using components?](#how-to-extend-the-api-using-components)
    1. [How to create Services?](#how-to-create-services)
    1. [Add Fastify plugins](#add-fastify-plugins)
    1. [Add NPM modules](#add-npm-modules)
1. [FAQ](#faq)
1. [Contribution](#contribution)
1. [License](#mit-license)

# Motivation
Offer good tools for development API's and Microservices easily. Inspiration from LoopBack Framework.

# Getting Started

## Installation

It's available as an [npm package](https://npmjs.org/package/pgfy).

Install PgFy locally via npm:

```
$ npm install -g pgfy
```

## Using PgFy for the first time

With PgFy you have two options, the "Api" and "Service" instances.
The Api allows you to create a web server running, exposing your Postgres database, with all the common endpoints for it (Create, Read, Update, Delete).

Plug-and-play, with _zero code_ you can access the documentation automatically generated
(default at http://localhost:3000/documentation) all your database tables become an endpoint, for
create, read, update or delete the data.

----
app.js
```javascript
const { Api, Service } = require('pgfy');
const app = await Api();
app.start();
```

----
## Controlling PgFy with environment variables

Here's a list of environment variables PgFy supports:

| Variable name                                | Description |
| --------------------------:                  | :---------- |
| `PGFY_API_NAME`                              | API instance name. Default 'API'.
| `PGFY_API_HOST`                              | API instance host. Default 127.0.0.1.
| `PGFY_API_PORT`                              | API instance port. Default 3000.
| `PGFY_API_COMPONENTS_PATH`                   | The path to extend the API with components. Default '/src/components'.
| `PGFY_SERVICE_PATH`                          | The path for your services. Default '/src/services'.
| `PGFY_DATABASE_PG_HOST`                      | Postgres host. Default 127.0.0.1.
| `PGFY_DATABASE_PG_PORT`                      | Postgres port. Default 5432.
| `PGFY_DATABASE_PG_DATABASE`                  | Postgres database name. Default 'postgres'.
| `PGFY_DATABASE_PG_USER`                      | Postgres username. Default 'postgres'.
| `PGFY_DATABASE_PG_PWS`                       | Postgres password. Default ''.
| `PGFY_DATABASE_MONGODB_URL`                  | MongoDB Uri. Default 'mongodb://localhost:27017'.
| `PGFY_CACHE_REDIS_HOST`                      | Redis host. Default 127.0.0.1.
| `PGFY_CACHE_REDIS_PORT`                      | Redis port. Default 6379.
| `PGFY_CACHE_REDIS_GEOREDIS`                  | Redis Geolocation addon. Default true. See [Using Redis Geolocation Addon](https://www.npmjs.com/package/georedis)
| `PGFY_TLS_KEY_PATH`                          | TLS Key Path. Default your $PROJECT_FOLDER/server.key.
| `PGFY_TLS_CERT_PATH`                         | TLS Cert Path. Default your $PROJECT_FOLDER/server.cert.
| `PGFY_APM_SENTRY_DSN`                        | Your Sentry DSN.
| `PGFY_LOGGER_TIMBER_KEY`                     | Your Timer Key.
| `PGFY_PAYMENTS_GERENCIANET_CLIENT_ID`        | GerenciaNet Client ID.
| `PGFY_PAYMENTS_GERENCIANET_CLIENT_SECRET`    | GerenciaNet Client Secret.
| `PGFY_PUSH_NOTIFICATION_APNS_KEY_PATH`       | Apple APNS key path. Default your $PROJECT_FOLDER/key.pem
| `PGFY_PUSH_NOTIFICATION_APNS_CERT_PATH`      | Apple APNS Cert path. Default your $PROJECT_FOLDER/cert.pem
| `PGFY_PPUSH_NOTIFICATION_GCM_API_KEY`        | Google GCM API Key.
| `PGFY_OAUTH2_FACEBOOK_START_PATH`            | Facebook OAuth2.0 login endpoint. Default '/login/facebook'.
| `PGFY_OAUTH2_FACEBOOK_CALLBACK_URI`          | Facebook OAuth2.0 callback URI. Default 'https://localhost:3000/login/facebook/callback'.
| `PGFY_SWAGGER_HOST_PORT`                     | Swagger URI. Default '127.0.0.1:3000'.
| `PGFY_SWAGGER_ROUTE_PREFIX`                  | Swagger route access. Default '/documentation'.
| `PGFY_SWAGGER_INFO_TITLE`                    | Swagger Title. Default 'Swagger UI'.
| `PGFY_SWAGGER_INFO_DESCRIPTION`              | Swagger Description. Default 'Swagger UI - API Documentation'.
| `PGFY_SWAGGER_INFO_VERSION`                  | Swagger Version. Default '1.0.0'.


# Tools built-in

## API's with Fastify
Fast and low overhead web framework, for Node.js.
An efficient server implies a lower cost of the infrastructure, a better responsiveness under load and happy users. How can you efficiently handle the resources of your server, knowing that you are serving the highest number of requests as possible, without sacrificing security validations and handy development?

Enter Fastify. Fastify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture. It is inspired by Hapi and Express and as far as we know, it is one of the fastest web frameworks in town.

- [Fastify Benchmarks](https://github.com/fastify/fastify#benchmarks)
- [Fastify Documentation](https://github.com/fastify/fastify#documentation)

### Plugins pre-configured:
- [fastify-cors](https://github.com/fastify/fastify-cors)
- [fastify-helmet](https://github.com/fastify/fastify-helmet)
- [fastify-rate-limit](https://github.com/fastify/fastify-rate-limit)
- [fastify-oas](https://gitlab.com/m03geek/fastify-oas)
- [fastify-tls-keygen](https://gitlab.com/sebdeckers/fastify-tls-keygen)
- [fastify-oauth2](https://github.com/fastify/fastify-oauth2)
- [fastify-metrics](https://gitlab.com/m03geek/fastify-metrics#http-routes-metrics)

### Modules pre-configured:
- [Lodash](https://lodash.com/docs)
```javascript
// my-new-component/controller.js
const users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];
const usersActive = api.modules._.find(users, 'active');
console.log('Users active: ', usersActive);
```

- [GeoRedis](https://www.npmjs.com/package/georedis)
```javascript
// my-new-component/controller.js
const locationSet = {
  Toronto: { latitude: 43.6667, longitude: -79.4167 },
  Blumenau: { latitude: -26.920609799999998, longitude: -49.0745791 },
};
// Add your locations using the ".geo" instance.
api.geo.addLocations(locationSet, (err, reply) => {
  if (err) console.error(err);
});

const options = {
  withCoordinates: true, // Will provide coordinates with locations, default false
  // withHashes: true, // Will provide a 52bit Geohash Integer, default false
  withDistances: true, // Will provide distance from query, default false
  order: 'ASC', // or 'DESC' or true (same as 'ASC'), default false
  units: 'km', // or 'km', 'mi', 'ft', default 'm'
  // count: 100, // Number of results to return, default undefined
  accurate: true, // Useful if in emulated mode and accuracy is important, default false
};
const KM = 20;
api.geo.nearby({
  latitude: request.params.latitude,
  longitude: request.params.longitude,
}, KM, options, (err, locations) => {
  if (err) return api.response(reply, 404, 'Locations not found!', {});
  return api.response(reply, 200, 'Locations found', locations);
});
```
----
## Postgres database with MassiveJS
Massive is a data mapper for Node.js that goes all in on PostgreSQL and fully embraces the power and flexibility of the SQL language and relational metaphors. Providing minimal abstractions for the interfaces and tools you already use, its goal is to do just enough to make working with your data as easy and intuitive as possible, then get out of your way.

Massive is not an object-relational mapper (ORM)! It doesn't use models, it doesn't track state, and it doesn't limit you to a single entity-based metaphor for accessing and persisting data. Massive connects to your database and introspects its schemas to build an API for the data model you already have: your tables, views, functions, and easily-modified SQL scripts.

Basic usage
----

```javascript
...
/*
  Retrieval
*/

// FindOne
const testFindOne = await db.some_database.findOne({ id: 1});

// Find All
const testFind = await db.some_database.find({ status: 'PENDING' });

// Count
const testCount = await db.some_database.count({ id: 1 });

/*
  Persistence
*/

// Save
const testSave = await db.some_database.save({ name: 'Daniel', age: 33 });

// Update
const rowId = 1;
const testUpdate = await db.some_database.update(rowId, { name: 'Daniel', age: 33 });

// Delete
const rowId = 1;
const testSave = await db.some_database.destroy(rowId);

```

MassiveJS advanced usage
----

- [Check MassiveJS documentation](https://massivejs.org/docs/connecting)

----
## Micro-services with CoteJS
A Node.js library for building zero-configuration microservices

[CoteJS Features](https://github.com/dashersw/cote#features)

## How to implement Microservice pattern

```javascript
/*
  In your API controller.js at MACHINE 1
*/
...
api.requester.send({
  type: 'ping',
  body: request.body,
  params: request.params,
  user,
}, (err, responseWithPong) => {
  if (err) return api.response(reply, 500, 'Timeout', {});
  return api.response(reply, 200, responseWithPong, {});
});
```

```javascript
/*
  In your SERVICE router.js at MACHINE 2
*/
...
responder.on('ping', controller.ping);

/*
  In your SERVICE controller.js at MACHINE 2
*/
...
const controllers = {
  ping: async (req, cb) => {
    try {
      return cb('Pong', true);
    } catch (e) {
      return cb(e.message, false);
    }
  }
}
```

# Advanced Usage

# CLI

PgFy CLI
```
Terminal

$ pgfy

? Which template do you want to create? (Use arrow keys)
❯ A new Api component 
  A new Service 

? Which template do you want to create? A new Api component
? Type the name my-new-component
```

## How to extend the API using components?

By default, the Api will check your env variable PGFY_API_COMPONENTS_PATH (by default is 'src/components') looking for new components.

---
Take a look for what is a "component" inside PgFy.
```
/src/components
  |-- my_new_compoment
      |-- controller.js
      |-- route.js
      |-- swagger.js
      |-- test.js
```

### Router.js file
```javascript
function Routes(api, componentName, swagger, controller) {
  try {
    // api: instance, where you can set new routes.
    // componentName: The name you choosed for you component.
    // swagger: Swagger config specifications for your controllers.
    // controller: Your functions avaliables for your routes.
    api.get(`/v1/${componentName}/hello-world`, swagger.helloWorld, controller.helloWorld);

    return controller;
  } catch (e) {
    console.log(`Error loading routes for ${componentName}:`, e.message);
    return e.message;
  }
}
module.exports = Routes;
```

### Swagger.js file
```javascript

function main(api, componentName) {
  /*
    Fastify: Validation and Serialization document
    https://www.fastify.io/docs/latest/Validation-and-Serialization/
  */
  const swagger = {
    helloWorld: {
      schema: {
        description: 'helloWorld',
        tags: [componentName],
        summary: componentName,
        querystring: {
          type: 'object',
          properties: {
            offset: { type: 'string' },
            limit: { type: 'number' },
          },
        },
        params: {},
        body: {},
        security: [
          {
            Bearer: [],
          },
        ],
      },
    },
  };
  return swagger;
}
module.exports = main;
```

### Controller.js file
```javascript
function Controller(api, componentName) {
  const { db } = api;
  const controllers = {
    helloWorld: async (request, reply) => {
      api.response(reply, 200, 'Hello World', {});
    },
  };
  return controllers;
}
module.exports = Controller;
```

### Test.js file
```javascript
function tests(api, componentName) {
  const contracts = {};
  /*
    PgFy will look for contracts for your Controllers.
    They need to have the same method name. E.g: controller.helloWorld()
    and contracts.helloWorld().
    Than you can add one or more test cases as the sample below.
    PgFy will check if the status, message or data are different as
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
      status: 200,
      message: 'Hello World',
      data: {},
    };
    return testCase;
  };
  return { contracts };
}
module.exports = tests;
```

## How to create Services?

By default, the Service will check your env variable PGFY_SERVICE_PATH (by default is '/src/services') looking for new services.

---
Take a look for what is a "Service" inside PgFy.
```
/src/services
  |-- user
    |-- management (A component of the User Service)
        |-- controller.js
        |-- route.js
        |-- test.js
```

### Route.js file
```javascript
async function loadRoutes(responder, controller) {
  try {
    responder.on('hello', controller.helloWorld);
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = loadRoutes;
```

### Controller.js file
```javascript
function controller(service) {
  const { db } = service;
  const controllers = {
    helloWorld: async (req, cb) => {
      try {
        return cb(null, 'Hello-World !!!');
      } catch (e) {
        return cb(e.message, false);
      }
    },
  };
  return controllers;
}
module.exports = controller;
```

### Test.js file
```javascript
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
```

### Add Fastify plugins?
Offcourse. To add a new plugin, pass it inside your API configuration:
```
Terminal

$ npm install --save fastify-oas
```
```javascript
const app = await Api({
  plugins: [
    {
      name: 'fastify-oas',
      options: {},
    }
  ]
});
```

### Add NPM modules?
Definitely. To add a new NPM module, pass it inside your API configuration:
```
Terminal

$ npm install --save moment
```
```javascript
const app = await Api({
  modules: [
    {
      variable: 'moment',
      name: 'moment',
      options: {}
    }
  ]
});
console.log('Modules: ', app.modules.moment);
```

----
# FAQ

## Is PgFy a Fastify fork?
No. PgFy it's the Fastify framework, pre-configured, with some tools that allow you growth your application easily using components pattern.

# Can I override the auto generated endpoints?
Yes. Create a new component, set the same Route path for your new Controller.

----
# Contribution

PgFy is under constant development for my personal use, if you would like to see
a feature implemented or want to contribute a new feature, you are welcome to open
an issue to discuss it and we will be more than happy to help.

If you choose to make a contribution, please fork this repository, work on a
feature and submit a pull request.

MIT License
----

Copyright (c) 2019 Daniel Henrique. Built in Blumenau ❤️.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
