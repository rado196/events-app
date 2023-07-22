const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

const boolean = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.BOOLEAN,
  });
};

module.exports.boolean = boolean;
