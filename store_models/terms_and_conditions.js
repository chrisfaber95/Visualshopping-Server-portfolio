const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Terms_And_Conditions = sequelize.connection.define('terms_and_conditions', {
    TAC_id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'TAC_id'
    },
    content: {
        type: Sequelize.TEXT,
        field: 'content'
    }
    //shop_id: {
    //    type: Sequelize.UUID,
    //    field: 'shop_id',
    //}
    }, {
        freezeTableName: true,
        tableName: 'Terms_And_Conditions',
        paranoid: false,
        timestamps: false,
        defaultScope: {
            attributes: {  }
        }
    }
);

module.exports = {
    Terms_And_Conditions
};
