const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var CustomerHasFavorite = sequelize.connection.define('customer_has_favorite', {
    customer_has_favorite_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'customer_has_favorite_id'
    },
    customer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: 'customer_id'
    },
    product_id: {
        type: Sequelize.INTEGER,
        field: 'product_id'
    }
    }, {
        freezeTableName: true,
        tableName: 'Customer_has_Favorite',
        timestamps: false,
        defaultScope: {
           // attributes: { exclude:  ['password', 'accessToken'] }
        }
    }
);

//Customer.Userrole = Customer.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    CustomerHasFavorite
};
