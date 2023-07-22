const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex, buildForeignKey } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { Event } = require('../../models/Event');
const { Region } = require('../../models/Region');
const { Category } = require('../../models/Category');
const { Venue } = require('../../models/Venue');

const tableInfo = buildTableInfo(Event, 9_028_125_023_487);

const tableIndexes = [
  buildUniqueIndex({
    model: Event,
    fields: ['itemId'],
  }),
  buildForeignKey({
    sourceModel: Event,
    sourceField: 'regionId',
    targetModel: Region,
    targetField: 'id',
  }),
  buildForeignKey({
    sourceModel: Event,
    sourceField: 'categoryId',
    targetModel: Category,
    targetField: 'id',
  }),
  buildForeignKey({
    sourceModel: Event,
    sourceField: 'venueId',
    targetModel: Venue,
    targetField: 'id',
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    regionId: dataTypes.resourceIdentifier(),
    categoryId: dataTypes.resourceIdentifier({ allowNull: true }),
    venueId: dataTypes.resourceIdentifier(),

    itemId: dataTypes.intBigUnsigned(),
    url: dataTypes.string({ length: 500 }),
    imageUrl: dataTypes.string({ allowNull: true, length: 500 }),
    title: dataTypes.string(),
    description: dataTypes.string({ allowNull: true, length: 15_000 }),
    date: dataTypes.dateTime(),
    dateType: dataTypes.string(),
    age: dataTypes.intSmallUnsigned({ allowNull: true }),
    minPrice: dataTypes.doubleUnsigned({ allowNull: true }),
    maxPrice: dataTypes.doubleUnsigned({ allowNull: true }),
    latitude: dataTypes.double({ allowNull: true }),
    longitude: dataTypes.double({ allowNull: true }),
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
