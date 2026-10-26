const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var RecordUoMs = sequelize.connection.define('record_uoms', {
    RecordUoMs_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'RecordUoMs_id'
    },
    label: {
        type: Sequelize.STRING,
        field: 'label'
    }
    }, {
        freezeTableName: true,
        tableName: 'RecordUoMs',
        timestamps: false
    }
);

module.exports = {
    RecordUoMs
};
