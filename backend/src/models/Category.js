const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class Category extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, Category, {
      category: dataTypes.string(),
    });
  }

  static associate(models) {
    Category.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'categoryId',
      sourceKey: 'id',
    });
  }
}

module.exports = Category;
module.exports.Category = Category;
