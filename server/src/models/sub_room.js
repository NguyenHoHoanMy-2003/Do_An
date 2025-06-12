'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubRoom extends Model {
    static associate(models) {
      SubRoom.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room',
        onDelete: 'CASCADE'
      });
      
      SubRoom.belongsTo(models.User, {
        foreignKey: 'renter_id',
        as: 'renter'
      });
    }
  }

  SubRoom.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    renter_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'pending', 'disabled'),
      defaultValue: 'available',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SubRoom',
    tableName: 'sub_rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return SubRoom;
};