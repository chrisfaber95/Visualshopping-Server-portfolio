const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Spaaractie = sequelize.connection.define('spaaractie', {
    spaaractie_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: 'spaaractie_id'
    },
    slug:{
        type: Sequelize.STRING,
        field: 'slug'
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    description: {
        type: Sequelize.TEXT,
        field: 'description'
    },
    koptekst: {
        type: Sequelize.TEXT,
        field: 'koptekst'
    },
    imgurl: {
        type: Sequelize.STRING,
        field: 'imgurl'
    },
    start_date: {
        type: Sequelize.DATE,
        field: 'start_date',
        unique: true
    },
    end_date:{
        type: Sequelize.DATE,
        field: 'end_date'
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
    },
    amount_of_stamps:{
        type: Sequelize.INTEGER,
        field: 'amount_of_stamps'
    },
    point_for_stamp:{
        type: Sequelize.INTEGER,
        field: 'point_for_stamp'
    },
    stamp_price:{
        type: Sequelize.DECIMAL(10, 2),
        field: 'stamp_price'
    },
    stamp_imgurl:{
        type: Sequelize.STRING,
        field: 'stamp_imgurl'
    },
    background_card:{
        type: Sequelize.STRING,
        field: 'background_card'
    },
    front_imgurl:{
        type: Sequelize.STRING,
        field: 'front_imgurl'
    },
    back_imgurl:{
        type: Sequelize.STRING,
        field: 'back_imgurl'
    },
    list_image:{
        type: Sequelize.STRING,
        field: 'list_image'
    },
    maincolor:{
        type: Sequelize.STRING,
        field: 'maincolor'
    },
    price_visible:{
        type: Sequelize.BOOLEAN,
        field: 'price_visible'
    },
    actietype_id:{
        type: Sequelize.INTEGER,
        field: 'actietype_id'
    },
    tac:{
        type: Sequelize.STRING,
        field: 'tac'
    },
    tac_pages:{
        type: Sequelize.INTEGER,
        field: 'tac_pages'
    },
    physical:{
        type: Sequelize.BOOLEAN,
        field: 'physical'
    }
    }, {
        freezeTableName: true,
        tableName: 'Spaaractie',
        paranoid: true,
        defaultScope: {
           // attributes: { exclude:  ['password', 'accessToken'] }
        }
    }
);

//Customer.Userrole = Customer.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

module.exports = {
    Spaaractie
};
