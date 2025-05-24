'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room'
      });
    }
  }
  Image.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'room_id'
    },
    image_url: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    underscored: true
  });
  return Image;
};