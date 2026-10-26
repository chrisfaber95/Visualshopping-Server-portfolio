const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {User} = require('./user.js');
//const { OrderHasProduct } = require('./order_has_products.js');
var OrderInformation = sequelize.connection.define('order_information', {
    order_information_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'order_information_id'
    },
    customerName: {
        type: Sequelize.STRING,
        field: 'customerName'
    },
    first_name: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    surname: {
        type: Sequelize.STRING,
        field: 'surname'
    },
    kvk: {
        type: Sequelize.STRING,
        field: 'kvk'
    },
    btw: {
        type: Sequelize.STRING,
        field: 'btw'
    },
    business: {
        type: Sequelize.STRING,
        field: 'business'
    },
    customerPhone: {
        type: Sequelize.STRING,
        field: 'customerPhone'
    },    
    customerEmail:{
        type: Sequelize.STRING,
        field: 'customerEmail'
    },
    klantenkaart:{
        type: Sequelize.STRING,
        field: 'klantenkaart'
    },
    street:{
        type: Sequelize.STRING,
        field: 'street'
    },
    house_number:{
        type: Sequelize.STRING,
        field: 'house_number'
    },
    house_addition:{
        type: Sequelize.STRING,
        field: 'house_addition'
    },
    city:{
        type: Sequelize.STRING,
        field: 'city'
    },
    zipcode:{
        type: Sequelize.STRING,
        field: 'zipcode'
    },
    createdAt:{
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    deletedAt:{
        type: Sequelize.DATE,
        field: 'deletedAt'
    }
    }, {
        freezeTableName: true,
        tableName: 'Order_Information',
        timestamps: true,
        paranoid: true
    }
);

//Order.PickingUser = Order.hasOne(User, { as: 'picking_user', foreignKey: 'user_id', targetKey: 'picking_user'})
//Order.ScanningUser = Order.hasOne(User, { as: 'scanning_user', foreignKey: 'user_id', targetKey: 'scanning_user'})
//Order.PickupUser = Order.hasOne(User, { as: 'pickup_user', foreignKey: 'user_id', targetKey: 'pickup_user'})

//Order.hasMany(OrderHasProduct, {as: 'product_list', foreignKey: 'order_id'})

module.exports = {
    OrderInformation
};
