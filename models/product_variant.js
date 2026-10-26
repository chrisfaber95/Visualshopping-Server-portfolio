const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var ProductVariant = sequelize.connection.define('product_variant', {
    product_variant_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_variant_id'
    },
    price_override: {
        type: Sequelize.DECIMAL(10,2),
        field: 'price_override'
    },
    discount_price_override: {
        type: Sequelize.DECIMAL(10,2),
        field: 'discount_price_override'
    },
    beschikbaar_override: {
        type: Sequelize.INTEGER,
        field: 'beschikbaar_override'
    },
    schapcode_override:{
        type: Sequelize.INTEGER,
        field: 'schapcode_override'
    },
    end_of_life_override:{
        type: Sequelize.INTEGER,
        field: 'end_of_life_override'
    },
    stock_override:{
        type: Sequelize.INTEGER,
        field: 'stock_override'
    },
    variant_group:{
        type: Sequelize.INTEGER,
        field: 'variant_group'
    },
    variant_label:{
        type: Sequelize.STRING,
        field: 'variant_label'
    },
    }, {
        freezeTableName: true,
        tableName: 'Product_Variant',
        timestamps: false
    }
);

module.exports = {
    ProductVariant
};
