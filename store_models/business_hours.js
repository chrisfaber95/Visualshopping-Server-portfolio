const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Business_Hours = sequelize.connection.define('business_hours', {
    business_hours_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'business_hours_id'
    },
    weekday: {
        type: Sequelize.INTEGER,
        field: 'weekday'
    },
    week: {
        type: Sequelize.INTEGER,
        field: 'week'
    },
    year: {
        type: Sequelize.INTEGER,
        field: 'year'
    },
    default: {
        type: Sequelize.BOOLEAN,
        field: 'default',
    },
    start: {
        type: Sequelize.TIME,
        field: 'start',
    },
    end: {
        type: Sequelize.TIME,
        field: 'end',
    },
    custom_label: {
        type: Sequelize.STRING,
        field: 'custom_label',
    }
    }, {
        freezeTableName: false,
        tableName: 'Business_Hours',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: { }
        }
    }
);

module.exports = {
    Business_Hours
};
