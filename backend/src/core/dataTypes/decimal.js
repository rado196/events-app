const { DataTypes } = require('sequelize');
const { makeColumn, withUnsigned } = require('./common');

const double = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.DOUBLE,
  });
};

const doubleUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.DOUBLE),
  });
};

const float = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.FLOAT,
  });
};

const floatUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.FLOAT),
  });
};

const real = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.REAL,
  });
};

const realUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.REAL),
  });
};

const decimal = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.DECIMAL,
  });
};

const decimalUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.DECIMAL),
  });
};

module.exports.double = double;
module.exports.doubleUnsigned = doubleUnsigned;
module.exports.float = float;
module.exports.floatUnsigned = floatUnsigned;
module.exports.real = real;
module.exports.realUnsigned = realUnsigned;
module.exports.decimal = decimal;
module.exports.decimalUnsigned = decimalUnsigned;
