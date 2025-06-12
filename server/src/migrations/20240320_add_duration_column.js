'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contracts', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Duration in months'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contracts', 'duration');
  }
}; 