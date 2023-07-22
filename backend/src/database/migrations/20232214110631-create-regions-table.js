const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { Region } = require('../../models/Region');

const tableInfo = buildTableInfo(Region, 8_273_924);

const tableIndexes = [
  buildUniqueIndex({
    model: Region,
    fields: ['region'],
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    region: dataTypes.string(),
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
