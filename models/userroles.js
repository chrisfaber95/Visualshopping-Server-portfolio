const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Userrole = sequelize.connection.define('userrole', {
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'role_id'
    },
    roleName: {
        type: Sequelize.STRING,
        field: 'role_name'
    }
    }, {
        freezeTableName: true,
        tableName: 'Userrole',
        timestamps: false,
    }
);
module.exports = {
    Userrole
};
