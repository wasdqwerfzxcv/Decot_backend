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

      Message.belongsTo(models.Workspace, {
        as: 'workspace', 
        foreignKey: 'workspaceId', 
        targetKey: 'id',
      });
    }
  }
  Message.init({
    message:{
      type: DataTypes.STRING, 
      allowNull: false, 
    },
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
    },
    workspaceId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
      field: 'workspaceId',
    },
    timestamp:{
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    read:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};