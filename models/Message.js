'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User,{
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  Message.init({
    message:{
      type: DataTypes.STRING, 
      allowNull: true, 
    },
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
    },
    timestamp:{
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};