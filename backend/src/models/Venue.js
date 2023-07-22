const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class Venue extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, Venue, {
      itemId: dataTypes.intBigUnsigned(),
      venue: dataTypes.string(),
      address: dataTypes.string(),
      alias: dataTypes.string({ allowNull: true }),
    });
  }

  static associate(models) {
    Venue.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'venueId',
      sourceKey: 'id',
    });
  }
}

module.exports = Venue;
module.exports.Venue = Venue;
