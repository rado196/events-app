const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

module.exports.uuid = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  });
};
