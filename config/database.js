const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Decot', 'postgres', '0173149883', {
  host: 'localhost',
  dialect: 'postgres', // Replace with your preferred SQL dialect (e.g., mysql, postgres, etc.)
});

module.exports = {
  sequelize,
};