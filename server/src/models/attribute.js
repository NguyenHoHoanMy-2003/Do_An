// attribute.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attribute extends Model {
    static associate(models) {
      Attribute.hasOne(models.Post, { foreignKey: 'attributes_id' });
    }
  }
  Attribute.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },    
    price: DataTypes.STRING,
    acreage: DataTypes.STRING,
    published: DataTypes.STRING,
    hashtag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attribute',
    tableName: 'attributes',
    underscored: true
  });
  return Attribute;
};