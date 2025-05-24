'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    static associate(models) {
      Label.hasMany(models.Post, { foreignKey: 'label_id' });
    }
  }
  Label.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },    
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Label',
    tableName: 'labels',
    underscored: true
  });
  return Label;
};