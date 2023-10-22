'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'registeredVia', {
      type: Sequelize.STRING,
      allowNull: true,  // assuming it's okay for this to be null
      defaultValue: 'Direct' // assuming Direct is the default value
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'registeredVia');
  }
};
