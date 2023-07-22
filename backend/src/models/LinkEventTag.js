const { BaseModel, defineModel } = require('../core/model');
const dataTypes = require('../core/dataTypes');

class LinkEventTag extends BaseModel {
  static initiate(sequelize) {
    super.initiate(sequelize);

    return defineModel(sequelize, LinkEventTag, {
      eventId: dataTypes.resourceIdentifier(),
      tagId: dataTypes.resourceIdentifier(),
    });
  }
}

module.exports = LinkEventTag;
module.exports.LinkEventTag = LinkEventTag;
