'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    static associate(models) {
      // Một tầng thuộc về một tòa nhà
      Floor.belongsTo(models.Property, {
        foreignKey: 'property_id',
        as: 'property'
      });

      // Một tầng có nhiều phòng
      Floor.hasMany(models.Room, {
        foreignKey: 'floor_id',
        as: 'rooms'
      });
    }
  }

  Floor.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    property_id: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Floor',
    tableName: 'floors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return Floor;
};
