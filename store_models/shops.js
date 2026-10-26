const sequelize = require('../config/connection_store');
const { Sequelize, DataTypes } = require('sequelize');
var Shop = sequelize.connection.define('shop', {
    shop_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'shop_id'
    },
    shopname: {
        type: Sequelize.STRING,
        field: 'shopname'
    },
    database_name: {
        type: Sequelize.STRING,
        field: 'database_name'
    },
    database_pw: {
        type: Sequelize.STRING,
        field: 'database_pw',
    },
    database_user:{
        type: Sequelize.STRING,
        field: 'database_user'
    },
    styling_url:{
        type: Sequelize.STRING,
        field: 'styling_url'
    },
    domain:{
        type: Sequelize.STRING,
        field: 'domain'
    },
    TAC_id:{
        type: Sequelize.INTEGER,
        field: 'TAC_id'
    }
    }, {
        freezeTableName: true,
        tableName: 'Shops',
        paranoid: true,
        timestamps: false,
        defaultScope: {
            attributes: { exclude:  ['database_pw', 'database_name', 'database_user'] }
        }
    }
);

module.exports = {
    Shop
};
