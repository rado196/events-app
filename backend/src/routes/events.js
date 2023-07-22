const EventController = require('../controllers/EventController');

module.exports.prefix = '/events';

module.exports.register = function (router) {
  router.get('/pricing', EventController.getPricingRange);
  router.get('/', EventController.getAll);
  router.get('/:id', EventController.getById);
};
