const { XMLParser } = require('fast-xml-parser');

function parse(xmlContent) {
  try {
    const parser = new XMLParser();
    return parser.parse(xmlContent);
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * @param {string} xmlContent
 * @returns {string}
 * @throws {Error}
 */
const toJson = function (xmlContent, indent) {
  return JSON.stringify(parse(xmlContent), null, indent);
};

/**
 * @param {string} xmlContent
 * @returns {object}
 * @throws {Error}
 */
const toObject = function (xmlContent) {
  return parse(xmlContent);
};

module.exports.toJson = toJson;
module.exports.toObject = toObject;
