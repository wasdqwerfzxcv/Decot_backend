'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'lastAccessed', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'offline'
    });

    await queryInterface.addColumn('Users', 'expertise', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('Users', 'profilePic', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'lastAccessed');
    await queryInterface.removeColumn('Users', 'status');
    await queryInterface.removeColumn('Users', 'expertise');
    await queryInterface.removeColumn('Users', 'profilePic');
  }
};
