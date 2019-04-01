const _ = require('lodash');

const emptySchema = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  id: '',
  description: '',
  properties: {},
  required: [],
  type: 'object',
};

const convertColumnType = (column) => {
  let schemaProperty = {
    type: 'null',
  };
  switch (column.data_type) {
    case 'text':
    case '"char"':
    case 'uuid':
    case 'character varying':
      schemaProperty.type = 'string';
      break;

    case 'date':
      schemaProperty.type = 'string';
      schemaProperty.format = 'date';
      break;

    case 'timestamp with time zone':
    case 'timestamp without time zone':
    case 'timestamp':
      schemaProperty.type = 'string';
      schemaProperty.format = 'date-time';
      break;
    case 'boolean':
      schemaProperty.type = 'boolean';
      break;
    case 'real':
    case 'float8':
    case 'int':
    case 'smallint':
    case 'bigint':
    case 'integer':
    case 'double precision':
    case 'numeric':
      schemaProperty.type = 'number';
      break;
    case 'json':
    case 'jsonb':
      schemaProperty.type = 'object';
      schemaProperty.properties = {};
      break;
    case 'interval':
      schemaProperty = {
        oneOf: [
          {
            type: 'number',
            description: 'Duration in seconds',
          },
          {
            type: 'string',
            description: 'Descriptive duration i.e. 8 hours',
          },
          {
            type: 'object',
            description: 'Duration object',
            properties: {
              years: { type: 'number' },
              months: { type: 'number' },
              days: { type: 'number' },
              hours: { type: 'number' },
              minutes: { type: 'number' },
              seconds: { type: 'number' },
              milliseconds: { type: 'number' },
            },
          },
        ],
      };
      break;
    default:
      console.warn(`UNKNOWN TYPE: ${column.data_type}`);
      break;
  }

  return schemaProperty;
};

module.exports = function pgTablesToJsonSchema(options) {
  return new Promise(((resolve, reject) => {
    const PostgresSchema = require('pg-json-schema-export');
    const connection = {
      user: options.pgUser,
      password: options.pgPassword,
      host: options.pgHost,
      port: options.pgPort || 5432,
      database: options.pgDatabase,
    };
    // Collect excluded and included tables
    const includeTables = _.isString(options.includeTables) ? options.includeTables.split(',') : undefined;
    const excludeTables = _.isString(options.excludeTables) ? options.excludeTables.split(',') : undefined;
    PostgresSchema.toJSON(connection, options.pgSchema)
      .then((dump) => {
      // Format the tables and views into JSON schema's
      //
        const schemas = [];
        // eslint-disable-next-line consistent-return
        _.each(dump.tables, (table, tableName) => {
        // Check if the table is excluded
        //
          if (_.indexOf(excludeTables, tableName) !== -1) {
          // Continue to next item
          //
            return true;
          }
          // Check if we're limited to a set of tables
          // If so check the tableName is in the list
          //
          if (!includeTables || _.indexOf(includeTables, tableName) !== -1) {
            const schema = {
              $schema: 'http://json-schema.org/draft-06/schema#',
              $id: `${options.baseUrl + tableName}.json`,
              title: tableName[0].toUpperCase() + tableName.slice(1),
              description: `Generated: ${new Date()}`,
              properties: {},
              required: [],
              type: 'object',
              additionalProperties: options.additionalProperties === undefined
                ? false : !!options.additionalProperties,
            };
            _.each(table.columns, (column) => {
              schema.properties[column.column_name] = convertColumnType(column);
              schema.properties[column.column_name].description = column.col_description || '';
              // Add non nullable columns without a default to the required list
              //
              if (column.is_nullable === false && column.column_default === null) {
                schema.required.push(column.column_name);
              }
            });
            schemas.push(schema);
          }
        });
        resolve(schemas);
      })
      .catch(reject);
  }));
};
