const path = require('node:path');
const {
  ConnectionError: SequelizeConnectionError,
  ConnectionAcquireTimeoutError: SequelizeConnectionAcquireTimeoutError,
  ConnectionTimedOutError: SequelizeConnectionTimedOutError,
} = require('sequelize');

/**
 * @type {import('sequelize').Config}
 */
const configs = {
  // connection
  dialect: 'postgres',
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
  replication: {
    write: {
      host: process.env.DB_WRITE_HOSTNAME,
      port: process.env.DB_WRITE_PORT || process.env.DB_PORT,
      username: process.env.DB_WRITE_USERNAME,
      password: process.env.DB_WRITE_PASSWORD,
    },
    read: [],
  },

  // common configs
  logging: false,
  query: { plain: false },
  dialectOptions: {
    connectTimeout: 220_000,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },

  // pool
  pool: {
    max: 30,
    min: 0,
    acquire: 220_000,
    idle: 10_000,
  },

  models: [path.join(__dirname, '..', 'models', '*.js')],
  define: {
    defaultScope: {
      attributes: {
        exclude: [
          'created_at',
          'updated_at',
          'deleted_at',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      },
    },
  },

  // reconnect
  retry: {
    match: [
      /Deadlock/i,

      SequelizeConnectionError,
      /SequelizeConnectionError/i,
      /ConnectionError/i,

      SequelizeConnectionAcquireTimeoutError,
      /SequelizeConnectionAcquireTimeoutError/i,
      /ConnectionAcquireTimeoutError/i,

      SequelizeConnectionTimedOutError,
      /SequelizeConnectionTimedOutError/i,
      /ConnectionTimedOutError/i,
    ],
    max: 100,
    backoffBase: 3_000,
    backoffExponent: 1.5,
  },
  reconnect: {
    max_retries: 10,
    onRetry: function (attempts) {
      // eslint-disable-next-line no-console
      console.warning(
        `⚠️ Connection to database lost, trying to reconnect ... (attempts: ${attempts})`
      );
    },
  },

  // migration configs
  migrationStorage: 'sequelize',
  migrationStorageTableSchema: 'public',
  migrationStorageTableName: '__sequelize_meta_migrations',

  // seeder configs
  seederStorage: 'sequelize',
  seederStorageTableSchema: 'public',
  seederStorageTableName: '__sequelize_meta_seeders',
};

for (let i = 1; i <= 15; ++i) {
  if (process.env[`DB_READ_${i}_HOSTNAME`]) {
    configs.replication.read.push({
      host: process.env[`DB_READ_${i}_HOSTNAME`],
      port: process.env[`DB_READ_${i}_PORT`] || process.env.DB_PORT,
      username: process.env[`DB_READ_${i}_USERNAME`],
      password: process.env[`DB_READ_${i}_PASSWORD`],
    });
  }
}

if (configs.replication.read.length === 0) {
  configs.replication.read = [{ ...configs.replication.write }];
}

module.exports = configs;
module.exports.configs = configs;
module.exports.development = configs;
module.exports.test = configs;
module.exports.production = configs;
