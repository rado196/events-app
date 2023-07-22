const { DataTypes } = require('sequelize');
const { makeColumn } = require('./common');

const string = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: attributes.length
      ? DataTypes.STRING(attributes.length)
      : DataTypes.STRING,
  });
};

const varchar = function (attributes = {}) {
  return string(attributes);
};

const textTiny = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TEXT('tiny'),
  });
};

const text = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TEXT,
  });
};

const textMedium = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TEXT('medium'),
  });
};

const textLong = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TEXT('long'),
  });
};

const char = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: attributes.length
      ? DataTypes.CHAR(attributes.length)
      : DataTypes.CHAR,
  });
};

module.exports.string = string;
module.exports.varchar = varchar;
module.exports.textTiny = textTiny;
module.exports.text = text;
module.exports.textMedium = textMedium;
module.exports.textLong = textLong;
module.exports.char = char;
