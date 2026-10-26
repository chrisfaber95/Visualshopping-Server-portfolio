const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Information = sequelize.connection.define('information', {
    information_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'information_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    phone: {
        type: Sequelize.STRING,
        field: 'phone'
    },
    mail: {
        type: Sequelize.STRING,
        field: 'mail',
    },
    kvk:{
        type: Sequelize.STRING,
        field: 'kvk'
    },
    btw:{
        type: Sequelize.STRING,
        field: 'btw'
    },
    mobile:{
        type: Sequelize.STRING,
        field: 'mobile'
    },
    admin_mail:{
        type: Sequelize.STRING,
        field: 'admin_mail'
    },
    logo_url:{
        type: Sequelize.STRING,
        field: 'logo_url'
    },
    contact_image_url:{
        type: Sequelize.STRING,
        field: 'contact_image_url'
    }
    }, {
        freezeTableName: true,
        tableName: 'Information',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: { }
        }
    }
);

module.exports = {
    Information
};
