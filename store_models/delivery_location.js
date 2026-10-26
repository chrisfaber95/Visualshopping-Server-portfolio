const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var DeliveryLocation = sequelize.connection.define('delivery_location', {
    delivery_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'delivery_location_id'
    },
    zipcode: {
        type: Sequelize.STRING,
        field: 'zipcode'
    },
    }, {
        freezeTableName: false,
        tableName: 'Delivery_Location',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: { }
        }
    }
);

module.exports = {
    DeliveryLocation
};
