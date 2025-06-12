'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.SubRoom, {
        foreignKey: 'subroom_id',
        as: 'SubRoom'
      });
      
      Contract.belongsTo(models.User, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });

      Contract.hasMany(models.PaymentHistory, { 
        foreignKey: 'contract_id',
        as: 'paymentHistories'
      });
    }
  }

  Contract.init({
    id_contract: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'id_contract'
    },
    subroom_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sub_rooms',
        key: 'id'
      }
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'signed', 'approved', 'disabled'),
      defaultValue: 'pending'
    },
    gia_thue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    signature_a: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Base64 image for signature of Party A'
    },
    signature_b: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Base64 image for signature of Party B'
    },
    contract_html_content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Full HTML content of the contract'
    },
    price_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Price in words'
    },
    pay_date: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Day of month for payment'
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Deposit amount'
    },
    deposit_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Deposit in words'
    }
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