const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var ProductAdditionInformation = sequelize.connection.define('product_additional_information', {
    product_additional_information_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_additional_information_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    value: {
        type: Sequelize.STRING,
        field: 'value'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    }
    }, {
        freezeTableName: true,
        tableName: 'Product_Additional_Information',
        timestamps: false
    }
);

module.exports = {
    ProductAdditionInformation
};
