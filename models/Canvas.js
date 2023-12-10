'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Canvas extends Model {
    static associate(models) {
      Canvas.belongsTo(models.User,{
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      Canvas.belongsTo(models.Board,{
        as: "board",
        foreignKey: 'boardId',
        onDelete: 'CASCADE'
      });
      Canvas.belongsTo(models.Workspace,{
        as: "workspace",
        foreignKey: 'workspaceId',
        onDelete: 'CASCADE'
      });
    }
  }
  Canvas.init({
    canvasName:{
      type: DataTypes.STRING, 
      allowNull: false, 
    },
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
    },
    boardId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
      field: 'boardId',
    },
    workspaceId:{
      type: DataTypes.INTEGER, 
      allowNull: false, 
      field: 'workspaceId',
    },
    canvasData:{
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'canvasData',
    },
  }, {
    sequelize,
    modelName: 'Canvas',
  });
  return Canvas;
};