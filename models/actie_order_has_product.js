const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {Order} = require('./order.js');
//const {Product} = require('./product.js');
//const {Product} = require('./product.js');
var ActieOrderHasProduct = sequelize.connection.define('actie_order_has_product', {
    actie_order_has_product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'actie_order_has_product_id'
    },
    amount: {
        type: Sequelize.INTEGER,
        field: 'amount'
    },
    price:{
        type: Sequelize.DECIMAL(10,2),
        field: 'price'
    },
    stamps_cost:{
        type: Sequelize.INTEGER,
        field: 'stamps_cost'
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
    }
    }, {
        freezeTableName: true,
        tableName: 'Actie_Order_has_Product',
        timestamps: false
    }
);

//OrderHasProduct.Product = OrderHasProduct.belongsTo(Product, { as: 'product', foreignKey: 'product_id', targetKey: 'product_id'})
//OrderHasProduct.Order = OrderHasProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id', targetKey: 'order_id'})

module.exports = {
    ActieOrderHasProduct
};
