const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

const json = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.JSON,
  });
};

const jsonb = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.JSONB,
  });
};

module.exports.json = json;
module.exports.jsonb = jsonb;
