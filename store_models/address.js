const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Address = sequelize.connection.define('address', {
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'address_id'
    },
    street: {
        type: Sequelize.STRING,
        field: 'street'
    },
    house_number: {
        type: Sequelize.STRING,
        field: 'house_number'
    },
    house_addition: {
        type: Sequelize.STRING,
        field: 'house_addition',
    },
    city:{
        type: Sequelize.STRING,
        field: 'city'
    },
    zipcode:{
        type: Sequelize.STRING,
        field: 'zipcode'
    }
    }, {
        freezeTableName: false,
        tableName: 'Address',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: { }
        }
    }
);

module.exports = {
    Address
};
