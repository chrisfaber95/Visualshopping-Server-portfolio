const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var ShoppingListHasProduct = sequelize.connection.define('shoppinglist_has_product', {
    list_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'list_product_id'
    },
    shopping_list_id:{
        type: DataTypes.UUID,
        field: 'shopping_list_id'
    },
    product_id:{
        type: DataTypes.INTEGER,
        field: 'product_id'
    },
    amount:{
        type: DataTypes.INTEGER,
        field: 'amount'
    }
    }, {
        freezeTableName: true,
        tableName: 'ShoppingList_has_Products',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: {  }
        }
    }
);

module.exports = {
    ShoppingListHasProduct
};
