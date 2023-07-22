const { Sequelize, DataTypes, Utils, Model, Op } = require('sequelize');
const { withUnsigned } = require('./dataTypes');
const { getSequelizeInstance } = require('./database');

class BaseModel extends Model {
  static Op = Op;
  static fn = Sequelize.fn;
  static literal = Sequelize.literal;
  static cast = Sequelize.cast;
  static where = Sequelize.where;

  static col = function (column) {
    return Sequelize.col(this.underscore(column));
  };

  static underscore = function (field) {
    return Utils.underscoredIf(field, true);
  };

  static buildTransaction(options) {
    const sequelize = this.sequelize || getSequelizeInstance();
    if (!sequelize) {
      throw new Error('The sequelize instance is not initialized.');
    }

    return sequelize.transaction(options);
  }

  static associate() {}
  static initiate(sequelize) {
    this.sequelize = this.sequelize || sequelize;
  }

  static hooks() {
    const hookAliases = {
      // phase 1) before bulk action
      beforeBulkCreate: 'onBeforeBulkCreate',
      beforeBulkDestroy: 'onBeforeBulkDestroy',
      beforeBulkUpdate: 'onBeforeBulkUpdate',

      // phase 2) before validate
      beforeValidate: 'onBeforeValidate',

      // phase 3) validating
      // ...

      // phase 4) after validate
      afterValidate: 'onAfterValidate',
      validationFailed: 'onValidationFailed',

      // phase 5) before action
      beforeCreate: 'onBeforeCreate',
      beforeDestroy: 'onBeforeDestroy',
      beforeUpdate: 'onBeforeUpdate',
      beforeSave: 'onBeforeSave',
      beforeUpsert: 'onBeforeUpsert',

      // phase 6) processing action
      // ...

      // phase 7) after action
      afterCreate: 'onAfterCreate',
      afterDestroy: 'onAfterDestroy',
      afterUpdate: 'onAfterUpdate',
      afterSave: 'onAfterSave',
      afterUpsert: 'onAfterUpsert',

      // phase 8) after bulk action
      afterBulkCreate: 'onAfterBulkCreate',
      afterBulkDestroy: 'onAfterBulkDestroy',
      afterBulkUpdate: 'onAfterBulkUpdate',
    };

    const hooks = {};
    for (const hookName in hookAliases) {
      const hookAlias = hookAliases[hookName];
      const hookAliasFunc = this[hookAlias];

      if (typeof hookAliasFunc === 'function') {
        hooks[hookName] = hookAliasFunc;
      }
    }

    return hooks;
  }

  static buildSearchableCondition(searchText, fields) {
    if (
      !searchText ||
      !fields ||
      !Array.isArray(fields) ||
      fields.length === 0
    ) {
      return {};
    }

    // @TODO: build searchable condition based on searchText.
    return {};
  }
}

const idFieldType = function () {
  // return DataTypes.UUID;
  return withUnsigned(DataTypes.BIGINT);
};

function buildIdField() {
  // return {
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   primaryKey: true,
  // };

  return {
    type: withUnsigned(DataTypes.BIGINT),
    primaryKey: true,
    autoIncrement: true,
  };
}

function buildTimestampField(defaultValue) {
  return {
    type: DataTypes.DATE,
    allowNull: !defaultValue,
    defaultValue: defaultValue,
  };
}

function updateFieldNames(fields) {
  return Object.keys(fields).reduce(function (acc, field) {
    acc[field] = {
      field: Utils.underscoredIf(field, true),
      ...fields[field],
    };
    return acc;
  }, {});
}

const defineModel = function (sequelize, modelClass, fields) {
  const modelName = modelClass.name;
  const tableName = modelClass.tableName
    ? modelClass.tableName
    : Utils.pluralize(Utils.underscoredIf(modelName, true));

  const finalFields = updateFieldNames({
    id: buildIdField(),
    createdAt: buildTimestampField(Sequelize.fn('NOW')),
    updatedAt: buildTimestampField(Sequelize.fn('NOW')),
    deletedAt: buildTimestampField(null),
    ...fields,
  });

  const modelProperties = {
    sequelize,
    modelName: modelName,
    schema: modelClass.schemaName || process.env.DB_SCHEMA,
    tableName: tableName,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    hooks: modelClass.hooks(),
  };

  modelClass.sequelize = sequelize;
  return modelClass.init(finalFields, modelProperties);
};

module.exports.BaseModel = BaseModel;
module.exports.idFieldType = idFieldType;
module.exports.defineModel = defineModel;
