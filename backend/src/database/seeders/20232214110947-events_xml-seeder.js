const { bootstrapModels } = require('../../core/database');
const EventService = require('../../services/EventService');

// seeder up
module.exports.up = async function (queryInterface) {
  bootstrapModels(queryInterface.sequelize);

  const result = EventService.parseFile('export.xml');
  const events = result?.subevents?.subevent || [];

  return EventService.insertParsedEvents(events);
};

// seeder down
module.exports.down = async function (queryInterface) {};
