'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Canvases');
  },

  down: async (queryInterface, Sequelize) => {
    // You can add logic to recreate the table in the down migration if needed
  },
};