const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {Order} = require('./order.js');
//const {Product} = require('./product.js');
//const {Product} = require('./product.js');
var SpaaractieHasProduct = sequelize.connection.define('spaaractie_has_product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'spaaractie_has_product_id'
    },
    spaaractie_id: {
        type: Sequelize.INTEGER,
        field: 'spaaractie_id'
    },
    product_id: {
        type: Sequelize.INTEGER,
        field: 'product_id'
    },
    discount_percentage:{
        type: Sequelize.INTEGER,
        field: 'discount_percentage'
    },
    title:{
        type: Sequelize.STRING,
        field: 'title'
    },
    description:{
        type: Sequelize.STRING,
        field: 'description'
    },
    points_cost:{
        type: Sequelize.INTEGER,
        field: 'points_cost'
    },
    stamps_cost:{
        type: Sequelize.INTEGER,
        field: 'stamps_cost'
    }
    }, {
        freezeTableName: true,
        tableName: 'Spaaractie_has_Product',
        timestamps: false
    }
);

//OrderHasProduct.Product = OrderHasProduct.belongsTo(Product, { as: 'product', foreignKey: 'product_id', targetKey: 'product_id'})
//OrderHasProduct.Order = OrderHasProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id', targetKey: 'order_id'})

module.exports = {
    SpaaractieHasProduct
};
