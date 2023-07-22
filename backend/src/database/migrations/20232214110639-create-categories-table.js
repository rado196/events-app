const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { Category } = require('../../models/Category');

const tableInfo = buildTableInfo(Category, 645_645_733);

const tableIndexes = [
  buildUniqueIndex({
    model: Category,
    fields: ['category'],
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    category: dataTypes.string(),
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
