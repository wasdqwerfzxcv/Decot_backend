'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.belongsTo(models.User, {
        as: 'mentor', 
        foreignKey: 'mentorId' });
        
      Board.belongsToMany(models.User, {
        through: 'BoardMembers',
        as: 'members',
        foreignKey: 'boardId', //amend
        otherKey: 'userId',
        onDelete: 'CASCADE'
      });

      Board.belongsTo(models.Workspace, {
        as: 'workspace', 
        foreignKey: 'workspaceId', 
        //targetKey: 'id',
      });

      Board.hasMany(models.Canvas, { as: 'canvases' });
    }
  }

  Board.init({
    boardTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dtTag: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'workspaceId'
    },
    // lastatime: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Incomplete'
    },
  }, {
    sequelize,
    modelName: 'Board',
  });

  return Board;
};