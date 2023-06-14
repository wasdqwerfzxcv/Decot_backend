'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Workspace, { 
        as: 'ownedWorkspaces',
        foreignKey: 'mentorId'
       });
       
      User.hasMany(models.Notification, { 
        as: 'notifications', 
        foreignKey: 'userId' 
      });

      User.belongsToMany(models.Workspace, {
        through: 'WorkspaceMembers',
        as: 'workspaces',
        foreignKey: 'userId' // specify the exact foreign key to use
      });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};