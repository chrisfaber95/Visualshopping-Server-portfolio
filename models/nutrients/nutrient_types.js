const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var NutrientTypes = sequelize.connection.define('nutrient_types', {
    nutrient_type_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'nutrient_type_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    internal_name: {
        type: DataTypes.STRING,
        field: 'internal_name'
    }
    }, {
        freezeTableName: true,
        tableName: 'NutrientTypes',
        timestamps: false
    }
);

module.exports = {
    NutrientTypes
};
