'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      boardtitle: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Boards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dttag: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deadline: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
      description: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      mentorid: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      diagram: {
        allowNull: true,
        type: Sequelize.BLOB,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Boards');
  }
};