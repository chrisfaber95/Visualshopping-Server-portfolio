const sequelize = require('../config/connection');
const { Sequelize, DataTypes } = require('sequelize');
var Department = sequelize.connection.define('department', {
    department_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'department_id'
    },
    label: {
        type: Sequelize.STRING,
        field: 'label'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    slug: {
        type: Sequelize.STRING,
        field: 'slug'
    },
    main_department:{
        type: Sequelize.INTEGER,
        field: 'main_department',
    },
    nix18:{
        type: Sequelize.BOOLEAN,
        field: 'nix18',
    },
    visible:{
        type: Sequelize.BOOLEAN,
        field: 'visible',
    },
    imgurl:{
        type: Sequelize.STRING,
        field: 'imgurl',
    }
    }, {
        freezeTableName: true,
        tableName: 'Department',
        timestamps: false
    }
);

module.exports = {
    Department
};
