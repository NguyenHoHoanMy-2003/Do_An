'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contracts', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Additional notes for the contract'
    });

    await queryInterface.addColumn('contracts', 'termination_date', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Date when contract was terminated'
    });

    await queryInterface.addColumn('contracts', 'termination_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Reason for contract termination'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contracts', 'note');
    await queryInterface.removeColumn('contracts', 'termination_date');
    await queryInterface.removeColumn('contracts', 'termination_reason');
  }
}; 