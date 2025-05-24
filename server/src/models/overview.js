'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Overview extends Model {
    static associate(models) {
      Overview.hasOne(models.Post, { foreignKey: 'overview_id' });
    }
  }
  Overview.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: DataTypes.STRING,
    area: DataTypes.STRING,
    type: DataTypes.STRING,
    target: DataTypes.STRING,
    created: DataTypes.DATE,
    expire: DataTypes.DATE,
    bonus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Overview',
    tableName: 'overviews',
    underscored: true
  });
  return Overview;
};