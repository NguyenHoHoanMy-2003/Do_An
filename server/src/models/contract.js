
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.Room, { foreignKey: 'room_id' });
      Contract.belongsTo(models.User, { 
        foreignKey: 'tenant_id',
        as: 'tenant' 
      });
      Contract.hasMany(models.PaymentHistory, { foreignKey: 'contract_id' });
    }
  }

  Contract.init({
    id_contract: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    room_id: DataTypes.STRING,
    tenant_id: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'cancelled', 'terminated'),
      defaultValue: 'pending'
    },
    giaThue: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Contract',
    tableName: 'contracts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return Contract;
};