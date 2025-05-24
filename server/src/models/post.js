'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Attribute, { foreignKey: 'attributes_id' });
      Post.belongsTo(models.Category, { foreignKey: 'category_id' });
      Post.belongsTo(models.Label, { foreignKey: 'label_id' });
      Post.belongsTo(models.Overview, { foreignKey: 'overview_id' });
      Post.belongsTo(models.District, { foreignKey: 'district_id', as: 'district' });
      Post.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id_user' });
      Post.belongsTo(models.Property, { foreignKey: 'property_id', as: 'Property' });
      Post.belongsTo(models.Room, { foreignKey: 'room_id', as: 'room' });
    }
  }

  Post.init({
    id_post: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'id_post'
    },

    title: DataTypes.STRING,
    star: DataTypes.INTEGER,
    label_id: DataTypes.STRING,
    address: DataTypes.TEXT,
    description: DataTypes.TEXT,
    user_id: DataTypes.STRING,
    attributes_id: DataTypes.STRING,
    category_id: DataTypes.STRING,
    overview_id: DataTypes.STRING,
    property_id: DataTypes.STRING,
    room_id: DataTypes.STRING,
    district_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    underscored: true
  });

  return Post;
};
