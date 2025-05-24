'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });

      User.hasMany(models.Contract, {
        foreignKey: 'tenant_id',
        as: 'contracts'
      });

      User.hasMany(models.RentalInvoice, {
        foreignKey: 'tenant_id',
        as: 'invoices'
      });

      User.hasMany(models.Property, {
        foreignKey: 'host_id',
        as: 'properties'
      });
    }
  }
  User.init({
    id_user: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'id_user'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15)
    },
    role: {
      type: DataTypes.ENUM('admin', 'host', 'renter'),
      defaultValue: 'renter'
    },
    date_of_birth: { // ngày sinh
      type: DataTypes.DATE,
      field: 'date_of_birth'
    },
    gender: { // giới tính
      type: DataTypes.STRING(5),
      validate: {
        isIn: [['Nam', 'Nữ', 'Khác']]
      }
    },
    date_of_issue: { // ngày cấp
      type: DataTypes.DATE,
      field: 'date_of_issue'
    },
    place_of_issue: { //là nơi cấp
      type: DataTypes.STRING(100),
      field: 'place_of_issue'
    },
    permanent_address: { // địa chỉ thường trú
      type: DataTypes.TEXT,
      field: 'permanent_address'
    },
    national_id: { // số chứng minh thư
      type: DataTypes.STRING(20),
      field: 'national_id',
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  return User;
};