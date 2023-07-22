const {
  buildTableInfo,
  addConstraint,
  dropConstraint,
  dropTable,
  createTable,
} = require('../../core/migration');
const { buildUniqueIndex, buildForeignKey } = require('../../core/indexes');
const dataTypes = require('../../core/dataTypes');

const { LinkEventTag } = require('../../models/LinkEventTag');
const { Event } = require('../../models/Event');
const { Tag } = require('../../models/Tag');

const tableInfo = buildTableInfo(LinkEventTag, 4_124_821_371_023_049);

const tableIndexes = [
  buildUniqueIndex({
    model: LinkEventTag,
    fields: ['eventId', 'tagId'],
  }),
  buildForeignKey({
    sourceModel: LinkEventTag,
    sourceField: 'eventId',
    targetModel: Event,
    targetField: 'id',
  }),
  buildForeignKey({
    sourceModel: LinkEventTag,
    sourceField: 'tagId',
    targetModel: Tag,
    targetField: 'id',
  }),
];

// migration up
module.exports.up = async function (queryInterface) {
  await createTable(queryInterface, tableInfo, {
    eventId: dataTypes.resourceIdentifier(),
    tagId: dataTypes.resourceIdentifier(),
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
