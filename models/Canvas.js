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
    }
  }
  Canvas.init({
    canvas:{
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
    modelName: 'Canvas',
  });
  return Canvas;
};