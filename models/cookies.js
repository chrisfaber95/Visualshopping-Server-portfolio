const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Cookies = sequelize.connection.define('cookies', {
    cookie_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'cookie_id'
    },
    device: {
        type: Sequelize.STRING,
        field: 'device'
    },
    customer_id: {
        type: DataTypes.UUID,
        field: 'customer_id'
    },
    cookie_type: {
        type: DataTypes.STRING,
        field: 'cookie_type'
    },
    user_auth: {
        type: DataTypes.STRING,
        field: 'user_auth'
    },
    ip: {
        type: DataTypes.STRING,
        field: 'ip'
    },
    acceptance_date: {
        type: Sequelize.DATE,
        field: 'acceptance_date',
        defaultValue: DataTypes.NOW
    }
    }, {
        freezeTableName: true,
        tableName: 'Cookies',
        timestamps: false
    }
);

module.exports = {
    Cookies
};
