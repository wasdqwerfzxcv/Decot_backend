'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('Boards', 'boardtitle', 'boardTitle'),
      queryInterface.renameColumn('Boards', 'dttag', 'dtTag'),
      queryInterface.renameColumn('Boards', 'lastatime', 'lastATime'),
      queryInterface.renameColumn('Boards', 'lastsavedoc', 'lastSaveDoc'),
      queryInterface.renameColumn('Boards', 'mentorid', 'mentorId'),
      queryInterface.renameColumn('Boards', 'workspaceid', 'workspaceId'),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('Boards', 'boardTitle', 'boardtitle'),
      queryInterface.renameColumn('Boards', 'dtTag', 'dttag'),
      queryInterface.renameColumn('Boards', 'lastATime','lastatime'),
      queryInterface.renameColumn('Boards', 'lastSaveDoc','lastsavedoc'),
      queryInterface.renameColumn('Boards', 'mentorId','mentorid'),
      queryInterface.renameColumn('Boards', 'workspaceId','workspaceid'),
    ]);
  },
};
