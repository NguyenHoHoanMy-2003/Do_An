'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      // Một thành phố có nhiều quận
      City.hasMany(models.District, {
        foreignKey: 'city_id',
        as: 'districts'
      });

      // Một thành phố có nhiều tòa nhà
      City.hasMany(models.Property, {
        foreignKey: 'city_id',
        as: 'properties'
      });
    }
  }

  City.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return City;
};
