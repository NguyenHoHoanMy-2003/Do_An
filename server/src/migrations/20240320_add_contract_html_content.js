'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contracts', 'contract_html_content', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Full HTML content of the contract'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contracts', 'contract_html_content');
  }
}; 