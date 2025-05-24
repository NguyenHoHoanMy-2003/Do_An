'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      Property.belongsTo(models.User, {
        foreignKey: 'host_id',
        as: 'host'
      });

      Property.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'city'
      });

      Property.belongsTo(models.District, {
        foreignKey: 'district_id',
        as: 'district'
      });

      Property.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Property.hasMany(models.Floor, {
        foreignKey: 'property_id',
        as: 'floors'
      });

      Property.hasMany(models.Room, {
        foreignKey: 'property_id',
        as: 'rooms'
      });
    }
  }

  Property.init({
    id_property: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },    
    category_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    host_id: DataTypes.STRING,
    city_id: DataTypes.STRING,
    name_bd: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name_bd'
    },
    district_id: DataTypes.STRING,
    street_address: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return Property;
};
