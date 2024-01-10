const { Sequelize } = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync(process.env.DATABASE_SSL).toString()
    }
  }
});

module.exports = { sequelize };