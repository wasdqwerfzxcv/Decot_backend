'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      canvasId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      x: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      y: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};
