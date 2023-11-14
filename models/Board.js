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
        foreignKey: 'boardId' //amend
      });
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
    //diagram: {
        //type: DataTypes.BLOB,
        //allowNull: false,
    //},
    // lastatime: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
  }, {
    sequelize,
    modelName: 'Board',
  });

  return Board;
};