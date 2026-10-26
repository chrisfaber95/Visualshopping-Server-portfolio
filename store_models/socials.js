const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Socials = sequelize.connection.define('socials', {
    social_id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'social_id'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    },
    url: {
        type: Sequelize.STRING,
        field: 'url'
    },
    visible: {
        type: Sequelize.BOOLEAN,
        field: 'visible',
    },
    //shop_id: {
    //    type: Sequelize.UUID,
    //    field: 'shop_id',
    //}
    }, {
        freezeTableName: true,
        tableName: 'Socials',
        paranoid: true,
        timestamps: false,
        defaultScope: {
            attributes: {  }
        }
    }
);

module.exports = {
    Socials
};
