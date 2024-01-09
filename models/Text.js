'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Text extends Model {
        static associate(models) {
            Text.belongsTo(models.User, { foreignKey: 'userId' });
            Text.belongsTo(models.Canvas, { foreignKey: 'canvasId' });
        }
    }

    Text.init({
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
        width: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        height: {
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
        modelName: 'Text',
    });

    return Text;
};
