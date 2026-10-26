const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Levertijden = sequelize.connection.define('levertijden', {
    levertijd_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'levertijd_id'
    },
    minimum_days: {
        type: Sequelize.INTEGER,
        field: 'minimum_days'
    },
    maximum_days: {
        type: Sequelize.INTEGER,
        field: 'maximum_days'
    },
    label: {
        type: Sequelize.STRING,
        field: 'label'
    },
    }, {
        freezeTableName: true,
        tableName: 'Levertijden',
        timestamps: false
    }
);

module.exports = {
    Levertijden
};
