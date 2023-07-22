const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

const enumColumn = function (values, attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.ENUM(...values),
  });
};

module.exports.enumColumn = enumColumn;
