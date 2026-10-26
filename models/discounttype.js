const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var DiscountType = sequelize.connection.define('discounttype', {
    discounttype_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'discounttype_id'
    },
    discounttype_label: {
        type: Sequelize.STRING,
        field: 'discounttype_label'
    },
    min_amount: {
        type: Sequelize.INTEGER,
        field: 'min_amount'
    },
    default_calculation: {
        type: Sequelize.FLOAT,
        field: 'default_calculation'
    }
    }, {
        freezeTableName: true,
        tableName: 'DiscountType',
        timestamps: false
    }
);

module.exports = {
    DiscountType
};
