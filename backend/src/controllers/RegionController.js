const RegionService = require('../services/RegionService');

/**
 * @route GET /regions
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getAll = async function (req, res) {
  const { regions, count } = await RegionService.getAll(
    {
      search: req.query['search'],
      region: req.query['flt.region'] || req.query['flt.name'],
    },
    {
      limit: req.query['pg.limit'],
      offset: req.query['pg.offset'],
    }
  );
  res.send({ regions, count });
};

/**
 * @route GET /regions/:id
 *
 * @param {import('express').Request<{id: number}>} req
 * @param {import('express').Response} res
 */
module.exports.getById = async function (req, res) {
  const { region } = await RegionService.getById(req.params.id);
  res.send({ region });
};
