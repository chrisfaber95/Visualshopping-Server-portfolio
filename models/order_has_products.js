const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {Order} = require('./order.js');
//const {Product} = require('./product.js');
//const {Product} = require('./product.js');
var OrderHasProduct = sequelize.connection.define('order_has_product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'Order_has_Product_id'
    },
    amount: {
        type: Sequelize.INTEGER,
        field: 'amount'
    },
    order_id: {
        type: Sequelize.INTEGER,
        field: 'order_id'
    },
    product_id: {
        type: Sequelize.INTEGER,
        field: 'product_id'
    },
    price:{
        type: Sequelize.DECIMAL(10,2),
        field: 'price'
    },
    picked:{
        type: Sequelize.INTEGER,
        field: 'picked'
    },
    returned:{
        type: Sequelize.INTEGER,
        field: 'returned'
    },
    reason_return:{
        type: Sequelize.STRING,
        field: 'reason_return'
    },
    discounted_price:{
        type: Sequelize.DECIMAL(10,2),
        field: 'discounted_price'
    },
    normal_total_price:{
        type: Sequelize.DECIMAL(10,2),
        field: 'normal_total_price'
    },
    discount_override:{
        type: Sequelize.INTEGER,
        field: 'discount_override'
    }
    }, {
        freezeTableName: true,
        tableName: 'Order_has_Product',
        timestamps: false
    }
);

//OrderHasProduct.Product = OrderHasProduct.belongsTo(Product, { as: 'product', foreignKey: 'product_id', targetKey: 'product_id'})
//OrderHasProduct.Order = OrderHasProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id', targetKey: 'order_id'})

module.exports = {
    OrderHasProduct
};
