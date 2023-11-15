'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      boardtitle: {
        type: Sequelize.STRING,
      },
      dttag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deadline: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lastatime: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      lastsavedoc: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      mentorid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      diagram: {
        allowNull: true,
        type: Sequelize.BLOB,
      },
      workspaceid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Workspaces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Boards');
  }
};
