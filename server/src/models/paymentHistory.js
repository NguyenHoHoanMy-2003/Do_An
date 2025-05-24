'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentHistory extends Model {
    static associate(models) {
      PaymentHistory.belongsTo(models.RentalInvoice, { foreignKey: 'invoice_id' });
      PaymentHistory.belongsTo(models.Contract, { foreignKey: 'contract_id' });
    }
  }

  PaymentHistory.init({
    id_payment: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    invoice_id: DataTypes.STRING,
    contract_id: DataTypes.STRING,
    amountTotal: DataTypes.FLOAT,
    method: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'momo', 'zalo_pay'),
      defaultValue: 'cash'
    },
    paymentDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending'
    },
    type: {
      type: DataTypes.ENUM('deposit', 'rent'),
      defaultValue: 'rent'
    }
  }, {
    sequelize,
    modelName: 'PaymentHistory',
    tableName: 'payments_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return PaymentHistory;
};