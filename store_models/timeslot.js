const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Timeslots = sequelize.connection.define('timeslots', {
    timeslot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'timeslot_id'
    },
    timeslot_date: {
        type: Sequelize.DATEONLY,
        field: 'timeslot_date'
    },
    timeslot_start: {
        type: Sequelize.TIME,
        field: 'timeslot_start'
    },
    timeslot_end: {
        type: Sequelize.TIME,
        field: 'timeslot_end',
    },
    is_delivery: {
        type: Sequelize.BOOLEAN,
        field: 'is_delivery',
    },
    available_slots:{
        type: Sequelize.INTEGER,
        field: 'available_slots'
    }
    }, {
        freezeTableName: false,
        tableName: 'Timeslots',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: { }
        }
    }
);

module.exports = {
    Timeslots
};
