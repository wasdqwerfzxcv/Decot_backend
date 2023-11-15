'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', {});
    await queryInterface.addColumn('Messages', 'workspaceId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Workspaces',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize){
    await queryInterface.removeColumn('Messages', 'workspaceId');
  }
};
