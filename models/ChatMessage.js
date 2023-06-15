const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = require('../config/database');

const ChatMessage = define('ChatMessage',{
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.export = ChatMessage;
