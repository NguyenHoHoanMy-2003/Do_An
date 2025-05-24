'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      // Một quận thuộc về một thành phố
      District.belongsTo(models.City, {
        foreignKey: 'city_id',
        as: 'city'
      });

      // Một quận có nhiều tòa nhà
      District.hasMany(models.Property, {
        foreignKey: 'district_id',
        as: 'properties'
      });
    }
  }

  District.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'District',
    tableName: 'districts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return District;
};