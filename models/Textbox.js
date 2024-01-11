'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Textbox extends Model {
        static associate(models) {
            Textbox.belongsTo(models.User, { foreignKey: 'userId' });
            Textbox.belongsTo(models.Canvas, { foreignKey: 'canvasId' });
        }
    }

    Textbox.init({
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
        modelName: 'Textbox',
    });

    return Textbox;
};
