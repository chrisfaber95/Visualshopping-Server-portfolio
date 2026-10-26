const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var ShoppingList = sequelize.connection.define('shopping_list', {
    shopping_list_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'shopping_list_id'
    },
    createdAt:{
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updatedAt'
    }
    }, {
        freezeTableName: true,
        tableName: 'ShoppingList',
        paranoid: false,
        timestamps: true,
        defaultScope: {
            attributes: {  }
        }
    }
);

module.exports = {
    ShoppingList
};
