'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

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
        foreignKey: 'userId', // Key in User model
        otherKey: 'workspaceId' // Key in Workspace model
    });
    }

    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    registeredVia: DataTypes.STRING,
    lastAccessed: DataTypes.DATE,
    status: DataTypes.STRING,      
    expertise: DataTypes.STRING,   
    profilePic: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'User',
    hooks: {  // Add these hooks
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10); //"salt" is a random value that is combined with a password before the password is hashed
          user.password = await bcrypt.hash(user.password, salt); // ensure that the same password will produce different hash values when hashed with different salts. 
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return User;
};