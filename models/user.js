const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
const {Userrole} = require('./userroles.js');
var User = sequelize.connection.define('user', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email',
        unique: true
    },
    cardnumber: {
        type: Sequelize.STRING,
        field: 'cardnumber',
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        field: 'password'
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
    nfc_token:{
        type: Sequelize.STRING,
        field: 'nfc_token'
    },
    nfc_serial:{
        type: Sequelize.STRING,
        field: 'nfc_serial'
    },
    store:{
        type: Sequelize.STRING,
        field: 'store'
    },
    deletedAt:{
        type: Sequelize.DATE,
        field: 'deletedAt'
    }
    }, {
        freezeTableName: true,
        tableName: 'User',
        paranoid: true,
        defaultScope: {
            attributes: { exclude:  ['password', 'accessToken', 'nfcToken', 'nfcSerial'] }
        }
    }
);

//User.Userrole = User.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    User
};
