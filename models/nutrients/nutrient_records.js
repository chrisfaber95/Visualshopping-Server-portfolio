const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var NutrientRecords = sequelize.connection.define('nutrient_records', {
    nutrient_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'nutrient_record_id'
    },
    default_amount: {
        type: DataTypes.FLOAT,
        field: 'default_amount'
    },
    default_gda: {
        type: DataTypes.FLOAT,
        field: 'default_gda'
    },
    portion_amount: {
        type: DataTypes.FLOAT,
        field: 'portion_amount'
    },
    portion_gda: {
        type: DataTypes.FLOAT,
        field: 'portion_gda'
    }
    }, {
        freezeTableName: true,
        tableName: 'NutrientRecords',
        timestamps: false
    }
);

module.exports = {
    NutrientRecords
};
