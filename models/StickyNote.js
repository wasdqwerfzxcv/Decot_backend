'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StickyNote extends Model {
        static associate(models) {
            StickyNote.belongsTo(models.User, { foreignKey: 'userId' });
            StickyNote.belongsTo(models.Canvas, { foreignKey: 'canvasId' });
        }
    }

    StickyNote.init({
        text: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
        canvasId: DataTypes.INTEGER,
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
        modelName: 'StickyNote',
    });

    return StickyNote;
};
