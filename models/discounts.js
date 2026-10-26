const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
const { DiscountType } = require('./discounttype');
var Discounts = sequelize.connection.define('discounts', {
    discount_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'discount_id'
    },
    starting_date: {
        type: Sequelize.DATEONLY,
        field: 'starting_date'
    },
    end_date: {
        type: Sequelize.DATEONLY,
        field: 'end_date'
    },
    discount_image_url: {
        type: Sequelize.STRING,
        field: 'discount_image_url'
    },
    isCombination: {
        type: Sequelize.BOOLEAN,
        field: 'isCombination',
    }
    }, {
        freezeTableName: true,
        tableName: 'Discounts',
        timestamps: false,
        defaultScope: {
            include: [
                {model: DiscountType, as: 'discount_type'}
            ]
        }
    }
);

module.exports = {
    Discounts
};
