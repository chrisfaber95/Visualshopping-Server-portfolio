const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Daytotals = sequelize.connection.define('daytotals', {
    daytotal_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'daytotal_id'
    },
    date: {
        type: Sequelize.DATEONLY,
        field: 'date'
    },
    total_revenue: {
        type: Sequelize.DECIMAL(10,2),
        field: 'total_revenue'
    },
    timestamp: {
        type: Sequelize.DATE,
        field: 'timestamp',
        defaultValue: DataTypes.NOW
    },
    createdAt:{
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    deletedAt:{
        type: Sequelize.DATE,
        field: 'deletedAt'
    }
    }, {
        freezeTableName: true,
        tableName: 'Daytotals',
        timestamps: true
    }
);

module.exports = {
    Daytotals
};
