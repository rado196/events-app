const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { Venue } = require('../../models/Venue');

const tableInfo = buildTableInfo(Venue, 5_792_003);

const tableIndexes = [
  buildUniqueIndex({
    model: Venue,
    fields: ['itemId'],
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    itemId: dataTypes.intBigUnsigned(),
    venue: dataTypes.string(),
    address: dataTypes.string(),
    alias: dataTypes.string({ allowNull: true }),
  });

  for (const tableIndex of tableIndexes) {
    await addConstraint(queryInterface, tableInfo, tableIndex.name, tableIndex);
  }
};

// migration down
module.exports.down = async function (queryInterface) {
  for (const tableIndex of tableIndexes) {
    await dropConstraint(queryInterface, tableInfo, tableIndex.name);
  }

  await dropTable(queryInterface, tableInfo);
};
