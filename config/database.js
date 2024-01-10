const { Sequelize } = require('sequelize');
const sslCertificate = process.env.DATABASE_SSL.replace(/\\n/g, '\n');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: sslCertificate
    }
  }
});

module.exports = { sequelize };