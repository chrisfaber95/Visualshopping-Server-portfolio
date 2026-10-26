const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var JobOffer = sequelize.connection.define('job_offer', {
    job_offer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'job_offer_id'
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    description: {
        type: Sequelize.TEXT,
        field: 'description'
    },
    experience: {
        type: Sequelize.TEXT,
        field: 'experience',
    },
    labour_conditions:{
        type: Sequelize.TEXT,
        field: 'labour_conditions'
    },
    expires_at:{
        type: Sequelize.DATE,
        field: 'expires_at'
    },
    hours:{
        type: Sequelize.STRING,
        field: 'hours'
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
    },
    }, {
        freezeTableName: true,
        tableName: 'Job_Offer',
        paranoid: true,
        defaultScope: {}
    }
);

module.exports = {
    JobOffer
};
