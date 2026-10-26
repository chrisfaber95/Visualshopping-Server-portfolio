const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {User} = require('./user.js');
//const { OrderHasProduct } = require('./order_has_products.js');
var ActieOrder = sequelize.connection.define('actie_order', {
    actie_order_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'actie_order_id'
    },
    order_date:{
        type: Sequelize.DATE,
        field: 'order_date'
    },
    pickup_date:{
        type: Sequelize.DATEONLY,
        field: 'pickup_date'
    },
    status:{
        type: Sequelize.STRING,
        field: 'status'
    },
    pickup_time:{
        type: Sequelize.TIME,
        field: 'pickup_time'
    },
    paycode:{
        type: Sequelize.STRING,
        field: 'paycode'
    },
    delivery:{
        type: Sequelize.BOOLEAN,
        field: 'delivery'
    },
    delivery_cost:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'delivery_cost'
    },
    pickingtime:{
        type: Sequelize.DATE,
        field: 'picking_time'
    },
    pickedup_time:{
        type: Sequelize.DATE,
        field: 'pickedup_time'
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
        tableName: 'Actie_Order',
        timestamps: true
    }
);

//Order.PickingUser = Order.hasOne(User, { as: 'picking_user', foreignKey: 'user_id', targetKey: 'picking_user'})
//Order.ScanningUser = Order.hasOne(User, { as: 'scanning_user', foreignKey: 'user_id', targetKey: 'scanning_user'})
//Order.PickupUser = Order.hasOne(User, { as: 'pickup_user', foreignKey: 'user_id', targetKey: 'pickup_user'})

//Order.hasMany(OrderHasProduct, {as: 'product_list', foreignKey: 'order_id'})

module.exports = {
    ActieOrder
};
