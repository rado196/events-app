const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

const dateOnly = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.DATEONLY,
  });
};

const dateTime = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.DATE,
  });
};

const timeOnly = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TIME,
  });
};

module.exports.dateOnly = dateOnly;
module.exports.dateTime = dateTime;
module.exports.timeOnly = timeOnly;
