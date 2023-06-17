'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Workspaces', // name of the source model
      'color', // name of the key we are adding
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#000000'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Workspaces', // name of the source model
      'color' // key we want to remove
    );
  }
};
