const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
//const {User} = require('./user.js');
//const { OrderHasProduct } = require('./order_has_products.js');
var Order = sequelize.connection.define('order', {
    uuid_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'uuid_id'
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'order_id'
    },
    delivery: {
        type: Sequelize.BOOLEAN,
        field: 'delivery'
    },
    totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'totalPrice'
    },
    paymentMethod:{
        type: Sequelize.STRING,
        field: 'paymentMethod'
    },
    orderDate:{
        type: Sequelize.DATE,
        field: 'orderDate'
    },
    pickupDate:{
        type: Sequelize.DATEONLY,
        field: 'pickupDate'
    },
    status:{
        type: Sequelize.STRING,
        field: 'status'
    },
    pickupTime:{
        type: Sequelize.TIME,
        field: 'pickupTime'
    },
    pickingcrate:{
        type: Sequelize.STRING,
        field: 'pickingcrate'
    },
    paycode:{
        type: Sequelize.STRING,
        field: 'paycode'
    },
    winkelbon:{
        type: Sequelize.STRING,
        field: 'winkelbon'
    },
    finalPrice:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'finalPrice'
    },
    pickingtime:{
        type: Sequelize.DATE,
        field: 'pickingtime'
    },
    koopzegels:{
        type: Sequelize.INTEGER,
        field: 'koopzegels'
    },
    spaarzegels:{
        type: Sequelize.STRING,
        field: 'spaarzegels'
    },
    storepoints:{
        type: Sequelize.INTEGER,
        field: 'storepoints'
    },
    picking_price:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'picking_price'
    },
    pickup_code:{
        type: Sequelize.STRING,
        field: 'pickup_code'
    },
    pickup_confirm:{
        type: Sequelize.STRING,
        field: 'pickup_confirm'
    },
    id_check:{
        type: Sequelize.STRING,
        field: 'id_check'
    },
    scanningtime:{
        type: Sequelize.DATE,
        field: 'scanningtime'
    },
    pickedup_time:{
        type: Sequelize.DATE,
        field: 'pickedup_time'
    },
    invoice_number:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: async function() {
            // Generate a default invoice number using the current date/time and order number
            const now = new Date();
            const id = this.id;
            const ordersToday = await Order.count({ where: { createdAt: { [Sequelize.Op.gte]: startOfDay(now) } }});
            const orderNumber = ordersToday + 1;
            return generateInvoiceNumber('3555', this.orderType, now, orderNumber).toString();
            },
        field: 'invoice_number'
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
        tableName: 'Order',
        timestamps: true,
        paranoid: true
    }
);

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
  // Helper function to generate an invoice number based on the provided parameters
  function generateInvoiceNumber(storeNumber, orderType, date, orderNumber) {
    const prefix = orderType === 1 ? 'A' : 'B';
    const timestamp = Math.floor(date.getTime() / 1000);
    console.log(`00${storeNumber}${timestamp}${padNumber(orderNumber)}`)
    return `00${storeNumber}${timestamp}${padNumber(orderNumber)}`.toString();
  }

  function padNumber(number) {
    // Pad a number with a leading zero if it's less than 10
    if (number < 10) {
      return "000" + number;
    } 
    if (number < 100) {
        return "00" + number;
    }
    if (number < 1000) {
        return "0" + number;
    }  else {
      return number;
    }
  }
module.exports = {
    Order
};
