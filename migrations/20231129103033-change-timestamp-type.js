'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE "Messages" ALTER COLUMN "timestamp" TYPE TIMESTAMP WITH TIME ZONE USING "timestamp" AT TIME ZONE \'UTC\'');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE "Messages" ALTER COLUMN "timestamp" TYPE TIMESTAMP WITHOUT TIME ZONE USING "timestamp" AT TIME ZONE \'UTC\'')
  }
};
