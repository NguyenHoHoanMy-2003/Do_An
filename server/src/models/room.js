'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Contract, { foreignKey: 'room_id' });
      Room.hasMany(models.RentalInvoice, { foreignKey: 'room_id' });
      Room.hasMany(models.Image, {
        foreignKey: 'room_id',
        as: 'images'
      });
      Room.belongsTo(models.Property, {
        foreignKey: 'property_id',
        as: 'property'
      });
      Room.belongsTo(models.Floor, {
        foreignKey: 'floor_id',
        as: 'floor'
      });
      Room.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

    }
  }

  Room.init({
    id_room: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    property_id: DataTypes.STRING,
    category_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    floor_id: DataTypes.STRING,
    num_tenant: DataTypes.INTEGER,
    name: DataTypes.STRING,
    amenities: DataTypes.TEXT,
    bedroom_count: DataTypes.INTEGER,
    bed_count: DataTypes.INTEGER,
    bathroom_count: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'pending', 'disabled'),
      defaultValue: 'available'
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return Room;
};