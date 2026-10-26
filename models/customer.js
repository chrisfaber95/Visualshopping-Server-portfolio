const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Customer = sequelize.connection.define('customer', {
    customer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'customer_id'
    },
    first_name: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    updates: {
        type: Sequelize.TINYINT,
        field: 'updates'
    },
    surname: {
        type: Sequelize.STRING,
        field: 'surname'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email',
        unique: true
    },
    klantenkaart: {
        type: Sequelize.STRING,
        field: 'klantenkaart',
        unique: true,
        defaultValue: function() {
            return generateMyId()
        },
    },
    coopkaart: {
        type: Sequelize.BOOLEAN,
        field: 'coopkaart',
    },
    storepoints: {
        type: Sequelize.INTEGER,
        field: 'storepoints',
    },
    password:{
        type: Sequelize.STRING,
        field: 'password'
    },
    gender:{
        type: Sequelize.STRING,
        field: 'gender'
    },
    dob:{
        type: Sequelize.DATEONLY,
        field: 'dob'
    },
    createdAt:{
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    accessToken:{
        type: Sequelize.STRING,
        field: 'accessToken'
    },
    activated:{
        type: Sequelize.DATE,
        field: 'activated'
    },
    resettoken:{
        type: Sequelize.STRING,
        field: 'resettoken'
    },
    waitinglist:{        
        type: Sequelize.INTEGER,
        field: 'waitinglist',
    },
    phone:{        
        type: Sequelize.STRING,
        field: 'phone',
    },
    default_information:{
        type: DataTypes.UUID,
        field: 'default_information'
    },
    default_invoice_information:{
        type: DataTypes.UUID,
        field: 'default_invoice_information'
    },
    default_work_information:{
        type: DataTypes.UUID,
        field: 'default_work_information'
    },
    }, {
        freezeTableName: true,
        tableName: 'Customer',
        paranoid: true,
        defaultScope: {
            //attributes: { exclude:  ['password', 'accessToken'] }
        }
    }
);

    function generateMyId(){
        return Math.floor(1000000000000 + Math.random() * 9000000000000)
    }
//Customer.Userrole = Customer.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    Customer
};
