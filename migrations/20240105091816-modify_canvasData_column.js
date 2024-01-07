'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Change canvasData column to VARCHAR(255)
    await queryInterface.changeColumn('Canvases', 'canvasData', {
      type: Sequelize.STRING(255),
      allowNull: true // Set to false if this field should be not null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Canvases', 'canvasData', {
      type: Sequelize.TEXT,
      allowNull: true // Set to the original allowNull value
    });
  }
};
