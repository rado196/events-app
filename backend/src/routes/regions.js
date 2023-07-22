const RegionController = require('../controllers/RegionController');

module.exports.prefix = '/regions';

module.exports.register = function (router) {
  router.get('/', RegionController.getAll);
  router.get('/:id', RegionController.getById);
};
