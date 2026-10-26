const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {Order} = require('./order.js');
//const {Product} = require('./product.js');
//const {Product} = require('./product.js');
var actieOrderProductHasVariant = sequelize.connection.define('actie_order_product_has_variant', {
    actie_order_product_variant_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'actie_order_product_variant_id'
    },
    actie_order_has_product_id: {
        type: Sequelize.INTEGER,
        field: 'actie_order_has_product_id'
    },
    product_variant_id: {
        type: Sequelize.INTEGER,
        field: 'product_variant_id'
    }
    }, {
        freezeTableName: true,
        tableName: 'Actie_Order_Product_has_Variant',
        timestamps: false
    }
);

//OrderHasProduct.Product = OrderHasProduct.belongsTo(Product, { as: 'product', foreignKey: 'product_id', targetKey: 'product_id'})
//OrderHasProduct.Order = OrderHasProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id', targetKey: 'order_id'})

module.exports = {
    actieOrderProductHasVariant
};
