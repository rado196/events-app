const { DataTypes, Utils } = require('sequelize');
const { configs } = require('../../database/config');

const withUnsigned = function (ColumnType) {
  if (configs.dialect?.toLowerCase() === 'postgres') {
    return ColumnType;
  }

  return ColumnType.UNSIGNED;
};

const makeColumn = function (args = {}) {
  return {
    allowNull: false,
    underscored: true,
    ...args,
  };
};

const identifier = function (args = {}) {
  if (args.sequenceName) {
    // args.defaultValue = new Utils.Fn('nextval', `'${args.sequenceName}'`);
    args.defaultValue = new Utils.Literal(`nextval('${args.sequenceName}')`);

    delete args.sequenceName;
  } else {
    args.autoIncrement = true;
  }

  return makeColumn({
    ...args,
    primaryKey: true,
    type: withUnsigned(DataTypes.BIGINT),
  });
};

const resourceIdentifier = function (args = {}) {
  const commonOptions = {
    ...args,
  };

  if (commonOptions.references) {
    commonOptions.onDelete = commonOptions.onDelete || 'CASCADE';
    commonOptions.onUpdate = commonOptions.onUpdate || 'CASCADE';
  }

  // return makeColumn({
  //   ...commonOptions,
  //   type: DataTypes.UUID,
  // });

  return makeColumn({
    ...commonOptions,
    type: withUnsigned(DataTypes.BIGINT),
  });
};

module.exports.withUnsigned = withUnsigned;
module.exports.makeColumn = makeColumn;
module.exports.identifier = identifier;
module.exports.resourceIdentifier = resourceIdentifier;
