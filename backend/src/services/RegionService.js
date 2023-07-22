const { Region } = require('../models/Region');

/**
 * @returns {Promise<{ count: number, regions: Array<Region> }>}
 */
async function getAll({ search } = {}, { limit, offset } = {}) {
  const condition = Region.buildSearchableCondition(search, ['region']);

  const { rows: regions, count } = await Region.findAndCountAll({
    where: condition,
    limit: limit,
    offset: offset,
  });

  return { regions, count };
}

/**
 * @returns {Promise<{ region: Region }>}
 */
async function getById(id) {
  const region = await Region.findByPk(id);
  return { region };
}

module.exports.getAll = getAll;
module.exports.getById = getById;
