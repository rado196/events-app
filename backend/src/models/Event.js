const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class Event extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, Event, {
      venueId: dataTypes.resourceIdentifier(),
      categoryId: dataTypes.resourceIdentifier(),
      regionId: dataTypes.resourceIdentifier(),

      itemId: dataTypes.intBigUnsigned(),
      url: dataTypes.string({ length: 500 }),
      imageUrl: dataTypes.string({ allowNull: true, length: 500 }),
      title: dataTypes.string(),
      description: dataTypes.string({ allowNull: true, length: 15_000 }),
      date: dataTypes.dateTime(),
      dateType: dataTypes.string(),
      age: dataTypes.intSmallUnsigned({ allowNull: true }),
      minPrice: dataTypes.doubleUnsigned({ allowNull: true }),
      maxPrice: dataTypes.doubleUnsigned({ allowNull: true }),
      latitude: dataTypes.double({ allowNull: true }),
      longitude: dataTypes.double({ allowNull: true }),
    });
  }

  static associate(models) {
    Event.hasOne(models.Category, {
      as: 'category',
      foreignKey: 'id',
      sourceKey: 'categoryId',
    });

    Event.hasOne(models.Venue, {
      as: 'venue',
      foreignKey: 'id',
      sourceKey: 'venueId',
    });

    Event.hasOne(models.Region, {
      as: 'region',
      foreignKey: 'id',
      sourceKey: 'regionId',
    });

    Event.belongsToMany(models.Tag, {
      as: 'tags',
      through: {
        model: models.LinkEventTag,
        paranoid: false,
      },
      foreignKey: 'eventId',
      otherKey: 'tagId',
    });
  }
}

module.exports = Event;
module.exports.Event = Event;
