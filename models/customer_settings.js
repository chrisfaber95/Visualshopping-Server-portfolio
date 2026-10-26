const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var CustomerSettings = sequelize.connection.define('customer_settings', {
    customer_settings_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'customer_settings_id'
    },
    shoptype: {
        type: Sequelize.INTEGER,
        field: 'shoptype'
    },
    shopheight: {
        type: Sequelize.INTEGER,
        field: 'shopheight'
    },
    standard_promotions:{
        type: Sequelize.BOOLEAN,
        field: 'standard_promotions'
    },
    standard_storestamps:{
        type: Sequelize.BOOLEAN,
        field: 'standard_storestamps'
    },
    easy_order:{
        type: Sequelize.BOOLEAN,
        field: 'easy_order'
    },
    quick_scan:{
        type: Sequelize.BOOLEAN,
        field: 'quick_scan'
    }
    }, {
        freezeTableName: true,
        tableName: 'Customer_Settings',
        timestamps: false
    }
);

module.exports = {
    CustomerSettings
};
