const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {Productinformation} = require('./productinformation.js');
//const { OrderHasProduct } = require('./order_has_products.js');
//const { Order } = require('./order');
var Product = sequelize.connection.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_id'
    },
    categoryname1: {
        type: Sequelize.STRING,
        field: 'categoryname1'
    },
    department_id: {
        type: Sequelize.INTEGER,
        field: 'department_id'
    },
    categoryname2: {
        type: Sequelize.STRING,
        field: 'categoryname2'
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'price'
    },
    ean:{
        type: Sequelize.STRING,
        field: 'ean',
        allowNull: false,
        unique: true
    },
    schaphoogte:{
        type: Sequelize.INTEGER,
        field: 'schaphoogte'
    },
    schapplaats:{
        type: Sequelize.INTEGER,
        field: 'schapplaats'
    },
    beschikbaar:{
        type: Sequelize.INTEGER,
        field: 'beschikbaar'
    },
    schapcode:{
        type: Sequelize.STRING,
        field: 'schapcode'
    },
    btw:{
        type: Sequelize.FLOAT,
        field: 'btw'
    },
    statiegeld:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'statiegeld'
    },
    sup_price:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'sup_price'
    },
    end_of_life:{
        type: Sequelize.INTEGER,
        field: 'end_of_life'
    },
    stock:{
        type: Sequelize.INTEGER,
        field: 'stock'
    },
    nix18:{
        type: Sequelize.BOOLEAN,
        field: 'nix18',
    },
    syndyid:{
        type: Sequelize.STRING,
        field: 'syndyid',
    }
    }, {
        freezeTableName: true,
        tableName: 'Product',
        timestamps: false,
        defaultScope: {
            attributes :{ exclude: ['product_list']}
        }
    }
);

//Product.OrderHasProduct = Product.hasMany(OrderHasProduct, { as: 'order-list', foreignKey: 'product_id', targetKey: 'product_id'})

module.exports = {
    Product
};
