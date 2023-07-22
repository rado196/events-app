const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class Tag extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, Tag, {
      tag: dataTypes.string(),
    });
  }

  static associate(models) {
    Tag.belongsToMany(models.Event, {
      as: 'events',
      through: {
        model: models.LinkEventTag,
        paranoid: false,
      },
      foreignKey: 'tagId',
      otherKey: 'eventId',
    });
  }
}

module.exports = Tag;
module.exports.Tag = Tag;
