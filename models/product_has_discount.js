const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var ProductHasDiscount = sequelize.connection.define('product_has_discount', {
    product_discount_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_discount_id'
    },
    discount_price: {
        type: Sequelize.DECIMAL(10,2),
        field: 'discount_price'
    },
    isPercentage: {
        type: Sequelize.BOOLEAN,
        field: 'isPercentage'
    }
    }, {
        freezeTableName: true,
        tableName: 'Product_has_Discount',
        timestamps: false
    }
);

module.exports = {
    ProductHasDiscount
};
