'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RentalInvoice extends Model {
    static associate(models) {
      RentalInvoice.belongsTo(models.Room, { foreignKey: 'room_id' });
      RentalInvoice.belongsTo(models.User, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });
      RentalInvoice.hasMany(models.PaymentHistory, { foreignKey: 'invoice_id' });
    }
  }

  RentalInvoice.init({
    id_invoice: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    room_id: DataTypes.STRING,
    tenant_id: DataTypes.STRING,
    billingMonth: DataTypes.DATEONLY,
    roomFee: DataTypes.FLOAT,
    serviceFee: DataTypes.FLOAT,
    electricityBill: DataTypes.FLOAT,
    waterBill: DataTypes.FLOAT,
    totalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'RentalInvoice',
    tableName: 'rental_invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  return RentalInvoice;
};