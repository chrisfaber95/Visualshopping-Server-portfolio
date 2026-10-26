const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Nutrients = sequelize.connection.define('nutrients', {
    nutrients_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'nutrients_id'
    },
    syndyid: {
        type: Sequelize.STRING,
        field: 'syndyid'
    },
    has_portion: {
        type: DataTypes.BOOLEAN,
        field: 'has_portion'
    },
    portion_size: {
        type: DataTypes.STRING,
        field: 'portion_size'
    },
    NutrientId: {
        type: DataTypes.STRING,
        field: 'NutrientId'
    }
    }, {
        freezeTableName: true,
        tableName: 'Nutrients',
        timestamps: false,
    }
);

module.exports = {
    Nutrients
};
