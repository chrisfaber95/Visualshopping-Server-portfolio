const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Productinformation = sequelize.connection.define('productinformation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_information_id'
    },
    variant: {
        type: Sequelize.STRING,
        field: 'variant'
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    url: {
        type: Sequelize.STRING,
        field: 'url'
    },
    dataproduct:{
        type: Sequelize.STRING,
        field: 'dataproduct'
    },
    datasyndyproductid:{
        type: Sequelize.STRING,
        field: 'datasyndyproductid'
    },
    omschrijving:{
        type: Sequelize.TEXT,
        field: 'omschrijving'
    },
    imgurl:{
        type: Sequelize.STRING,
        field: 'imgurl'
    },
    ean:{
        type: Sequelize.STRING,
        field: 'ean',
        allowNull: false,
        unique: true
    },
    ingredients:{
        type: Sequelize.TEXT,
        field: 'ingredients'
    }
    }, {
        freezeTableName: true,
        tableName: 'Product_Information',
        timestamps: false
    }
);

module.exports = {
    Productinformation
};
