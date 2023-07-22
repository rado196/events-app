const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class Region extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, Region, {
      region: dataTypes.string(),
    });
  }

  static associate(models) {
    Region.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'regionId',
      sourceKey: 'id',
    });
  }
}

module.exports = Region;
module.exports.Region = Region;
