const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var CustomerHasSpaaractie = sequelize.connection.define('customer_has_spaaractie', {
    customer_has_spaaractie_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'customer_has_spaaractie_id'
    },
    /*customer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: 'customer_id'
    },
    spaaractie_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: 'spaaractie_id'
    },*/
    stamp_amount: {
        type: Sequelize.INTEGER,
        field: 'stamp_amount',
        validate: {
          min: {
            args: 0,
            msg: 'Aantal zegels kan niet lager dan 0 zijn.'
          }
        }
    },
    point_amount: {
        type: Sequelize.INTEGER,
        field: 'point_amount'
    },
    createdAt:{
        type: Sequelize.DATE,
        field: 'createdAt'
    },
    updatedAt:{
        type: Sequelize.DATE,
        field: 'updatedAt'
    },
    deletedAt:{
        type: Sequelize.DATE,
        field: 'deletedAt'
    }
    }, {
        freezeTableName: true,
        tableName: 'Customer_has_Spaaractie',
        paranoid: true,
        defaultScope: {
           // attributes: { exclude:  ['password', 'accessToken'] }
        }
    }
);

//Customer.Userrole = Customer.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    CustomerHasSpaaractie
};
