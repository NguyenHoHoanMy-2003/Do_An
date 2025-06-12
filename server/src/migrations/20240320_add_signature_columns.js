'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contracts', 'signature_a', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Base64 image for signature of Party A'
    });

    await queryInterface.addColumn('contracts', 'signature_b', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Base64 image for signature of Party B'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contracts', 'signature_a');
    await queryInterface.removeColumn('contracts', 'signature_b');
  }
}; 