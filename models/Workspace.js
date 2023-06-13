const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Workspace = sequelize.define('Workspace', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Other fields as required
});

module.exports = Workspace;