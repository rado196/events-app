const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { Tag } = require('../../models/Tag');

const tableInfo = buildTableInfo(Tag, 7_034_234_012);

const tableIndexes = [
  buildUniqueIndex({
    model: Tag,
    fields: ['tag'],
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    tag: dataTypes.string(),
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
