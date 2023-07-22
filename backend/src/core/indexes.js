const crypto = require('node:crypto');
const { Utils } = require('sequelize');

function buildResourceName(schema, table, field) {
  const parts = [schema, table];
  if (field) {
    parts.push(Utils.underscoredIf(field, true));
  }

  return parts
    .filter(function (part) {
      return !!part;
    })
    .join('.');
}

function getTableInfoFromModel(model, columnName) {
  const schema = model.schemaName || process.env.DB_SCHEMA;

  const modelName = model.name;
  const tableName = model.tableName
    ? model.tableName
    : Utils.pluralize(Utils.underscoredIf(modelName, true));

  const field = !columnName ? undefined : Utils.underscoredIf(columnName, true);
  return {
    schema: schema,
    model: modelName,
    table: tableName,
    field: field,
  };
}

function buildIndexName(type, parts) {
  const prefix = `idx::${type}::`;

  let indexName = parts.join('/');
  if (indexName.length + prefix.length > 60) {
    // replace index name to md5 when its too long
    indexName = crypto.createHash('md5').update(indexName).digest('hex');
    indexName = `${prefix}md5:${indexName}`;
  } else {
    indexName = `${prefix}${indexName}`;
  }

  return indexName;
}

const buildForeignKey = function (params) {
  const source = getTableInfoFromModel(params.sourceModel, params.sourceField);
  const target = getTableInfoFromModel(params.targetModel, params.targetField);

  const isSameSchema = source.schema === target.schema;
  const isSameTable = isSameSchema && source.table === target.table;

  const sourceName = buildResourceName(
    isSameSchema ? null : source.schema,
    isSameTable ? null : source.table,
    source.field
  );
  const targetName = buildResourceName(
    isSameSchema ? null : target.schema,
    isSameTable ? null : target.table,
    target.field
  );

  const foreignKeyName = buildIndexName('FK', [sourceName, targetName]);

  return {
    name: foreignKeyName,
    type: 'FOREIGN KEY',
    fields: [source.field],
    references: {
      table: {
        schema: target.schema,
        tableName: target.table,
      },
      field: target.field,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  };
};

const buildUniqueIndex = function (params) {
  const modelInfo = getTableInfoFromModel(params.model);
  const resource = buildResourceName(modelInfo.schema, modelInfo.table);

  const fields = params.fields.map(function (field) {
    return Utils.underscoredIf(field, true);
  });

  const uniqueIndexName = buildIndexName('UNQ', [resource, fields.join('+')]);

  return {
    name: uniqueIndexName,
    type: 'UNIQUE',
    fields: fields,
  };
};

module.exports.buildForeignKey = buildForeignKey;
module.exports.buildUniqueIndex = buildUniqueIndex;
