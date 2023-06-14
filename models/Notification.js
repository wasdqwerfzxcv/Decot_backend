'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  
  Notification.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    // Other fields for notifications
  }, {
    sequelize,
    modelName: 'Notification',
  });

  return Notification;
};