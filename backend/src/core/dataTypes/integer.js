const { DataTypes } = require('sequelize');
const { makeColumn, withUnsigned } = require('./common');

const intTiny = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.TINYINT,
  });
};

const intTinyUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.TINYINT),
  });
};

const intSmall = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.SMALLINT,
  });
};

const intSmallUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.SMALLINT),
  });
};

const int = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.INTEGER,
  });
};

const intUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.INTEGER),
  });
};

const intMedium = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.MEDIUMINT,
  });
};

const intMediumUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.MEDIUMINT),
  });
};

const intBig = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: DataTypes.BIGINT,
  });
};

const intBigUnsigned = function (attributes = {}) {
  return makeColumn({
    ...attributes,
    type: withUnsigned(DataTypes.BIGINT),
  });
};

module.exports.intTiny = intTiny;
module.exports.intTinyUnsigned = intTinyUnsigned;
module.exports.intSmall = intSmall;
module.exports.intSmallUnsigned = intSmallUnsigned;
module.exports.int = int;
module.exports.intUnsigned = intUnsigned;
module.exports.intMedium = intMedium;
module.exports.intMediumUnsigned = intMediumUnsigned;
module.exports.intBig = intBig;
module.exports.intBigUnsigned = intBigUnsigned;
