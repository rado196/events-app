const EventService = require('../services/EventService');

/**
 * @route GET /events/pricing
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getPricingRange = async function (req, res) {
  const { min, max } = await EventService.getPricingRange();
  res.send({ minPrice: min, maxPrice: max });
};

/**
 * @route GET /events
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getAll = async function (req, res) {
  const { events, count } = await EventService.getAll(
    {
      search: req.query['search'],
      minPrice: req.query['flt.minPrice'],
      maxPrice: req.query['flt.maxPrice'],
      regionId: req.query['flt.regionId'] || req.query['flt.region'],
      categoryId: req.query['flt.categoryId'] || req.query['flt.category'],
      venueId: req.query['flt.venueId'] || req.query['flt.venue'],
    },
    {
      limit: req.query['pg.limit'],
      offset: req.query['pg.offset'],
    }
  );

  res.send({ events, count });
};

/**
 * @route GET /events/:id
 *
 * @param {import('express').Request<{id: number}>} req
 * @param {import('express').Response} res
 */
module.exports.getById = async function (req, res) {
  const { event } = await EventService.getById(req.params.id);
  res.send({ event });
};
