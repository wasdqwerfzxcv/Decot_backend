'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.User, { foreignKey: 'userId' });
            Comment.belongsTo(models.Canvas, { foreignKey: 'canvasId' });
            Comment.hasMany(models.Comment, { as: 'replies', foreignKey: 'parentId' });
        }
    }

    Comment.init({
        text: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
        canvasId: DataTypes.INTEGER,
        resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        x: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        y: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        sequelize,
        modelName: 'Comment',
    });

    return Comment;
};
