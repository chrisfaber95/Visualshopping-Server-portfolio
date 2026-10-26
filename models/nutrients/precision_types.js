const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var PrecisionTypes = sequelize.connection.define('precision_types', {
    PrecisionTypes_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'PrecisionTypes_id'
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
        tableName: 'PrecisionTypes',
        timestamps: false
    }
);

module.exports = {
    PrecisionTypes
};
