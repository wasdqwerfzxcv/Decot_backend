'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Canvases', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      canvasName:{
        type: Sequelize.STRING,
        allowNull: false,
      },      
      canvasData: {
        type: Sequelize.TEXT, // Store XML data as TEXT
        allowNull: true, // Set to true if you allow NULL values
      },
      boardId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Boards', 
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
  
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Canvases');
  }
};
