'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Boards', 'workspaceId', {
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
    await queryInterface.removeColumn('Boards', 'workspaceId');
  }
};


