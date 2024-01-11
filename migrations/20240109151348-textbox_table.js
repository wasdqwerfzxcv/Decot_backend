'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Textboxes', {
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Textboxes');
  }
};
