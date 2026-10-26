const sequelize = require('../../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var PortionUoMs = sequelize.connection.define('portion_uoms', {
    PortionUoMs_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'PortionUoMs_id'
    },
    label: {
        type: Sequelize.STRING,
        field: 'label'
    }
    }, {
        freezeTableName: true,
        tableName: 'PortionUoMs',
        timestamps: false
    }
);

module.exports = {
    PortionUoMs
};
