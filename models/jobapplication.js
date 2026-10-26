const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Jobapplication = sequelize.connection.define('job_application', {
    job_application_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'job_application_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    birthday: {
        type: Sequelize.DATEONLY,
        field: 'birthday'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    zipcode: {
        type: Sequelize.STRING,
        field: 'zipcode'
    },
    house_number: {
        type: Sequelize.STRING,
        field: 'house_number'
    },
    house_addition: {
        type: Sequelize.STRING,
        field: 'house_addition'
    },
    city: {
        type: Sequelize.STRING,
        field: 'city'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    },
    phonenumber: {
        type: Sequelize.STRING,
        field: 'phonenumber'
    },
    cv: {
        type: Sequelize.STRING,
        field: 'cv'
    },
    motivatie: {
        type: Sequelize.STRING,
        field: 'motivatie'
    },
    beschikbaarheid: {
        type: Sequelize.TEXT,
        field: 'beschikbaarheid'
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
        tableName: 'Job_Application',
        timestamps: true
    }
);

module.exports = {
    Jobapplication
};
