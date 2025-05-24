//category.js 
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Post, { foreignKey: 'category_id' });
      Category.hasMany(models.Property, { foreignKey: 'category_id' });
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: DataTypes.STRING,
    value: DataTypes.STRING,
    header: DataTypes.STRING,
    subheader: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    underscored: true
  });
  return Category;
};