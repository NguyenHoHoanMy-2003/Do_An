'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contracts', 'signed_date', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Date when contract was signed'
    });

    await queryInterface.addColumn('contracts', 'contract_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Contract reference number'
    });

    await queryInterface.addColumn('contracts', 'price_text', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Price in words'
    });

    await queryInterface.addColumn('contracts', 'pay_date', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Day of month for payment'
    });

    await queryInterface.addColumn('contracts', 'deposit', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Deposit amount'
    });

    await queryInterface.addColumn('contracts', 'deposit_text', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Deposit in words'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contracts', 'signed_date');
    await queryInterface.removeColumn('contracts', 'contract_number');
    await queryInterface.removeColumn('contracts', 'price_text');
    await queryInterface.removeColumn('contracts', 'pay_date');
    await queryInterface.removeColumn('contracts', 'deposit');
    await queryInterface.removeColumn('contracts', 'deposit_text');
  }
}; 