const { createSchema, dropSchema } = require('../../core/migration');

// migration up
module.exports.up = async function (queryInterface) {
  await createSchema(queryInterface, 'events_app');
};

// migration down
module.exports.down = async function (queryInterface) {
  await dropSchema(queryInterface, 'events_app');
};
