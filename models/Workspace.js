'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Workspace.belongsTo(models.User, {
        as: 'mentor', 
        foreignKey: 'mentorId' });
        
        Workspace.belongsToMany(models.User, {
          through: 'WorkspaceMembers',
          as: 'members',
          foreignKey: 'workspaceId', // Key in Workspace model
          otherKey: 'userId' // Key in User model
      });
      
      Workspace.hasMany(models.Board, { as: 'boards' });
      Workspace.hasMany(models.Message, { as: 'messages', foreignKey: 'workspaceId' });
      Workspace.hasMany(models.Canvas, { as: 'canvases' });
    }
  }

  Workspace.init({
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
    joinToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    inviteLink: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#000000'
    },
  }, {
    sequelize,
    modelName: 'Workspace',
  });

  return Workspace;
};