const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var CustomerInformation = sequelize.connection.define('customer_information', {
    customer_information_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'customer_information_id'
    },
    first_name: {
        type: DataTypes.STRING,
        field: 'first_name'
    },
    surname: {
        type: DataTypes.STRING,
        field: 'surname'
    },
    phone: {
        type: DataTypes.STRING,
        field: 'phone'
    },
    street: {
        type: DataTypes.STRING,
        field: 'street'
    },
    house_number: {
        type: DataTypes.STRING,
        field: 'house_number'
    },
    house_addition: {
        type: DataTypes.STRING,
        field: 'house_addition'
    },
    city: {
        type: DataTypes.STRING,
        field: 'city'
    },
    zipcode: {
        type: DataTypes.STRING,
        field: 'zipcode'
    },
    business: {
        type: DataTypes.STRING,
        field: 'business'
    },
    kvk: {
        type: DataTypes.STRING,
        field: 'kvk'
    },
    btw: {
        type: DataTypes.STRING,
        field: 'btw'
    },
    title:{
        type: DataTypes.STRING,
        field: 'title'
    },
    contactperson:{
        type: DataTypes.STRING,
        field: 'contactperson'
    },
    businessphone:{
        type: DataTypes.STRING,
        field: 'businessphone'
    },
    custom_label:{
        type: DataTypes.STRING,
        field: 'custom_label'
    },
    }, {
        freezeTableName: true,
        tableName: 'Customer_Information',
        timestamps: false,
        defaultScope: {
           // attributes: { exclude:  ['password', 'accessToken'] }
        }
    }
);

//Customer.Userrole = Customer.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    CustomerInformation
};
