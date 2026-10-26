const mysql = require('mysql');
var Sequelize = require("sequelize");
const Logger = require('../config/logging.js')
require('dotenv').config();

var sequelize = new Sequelize(
	process.env.DB_NAME, 
	process.env.DB_USER, 
	process.env.DB_PASS, {
		host: process.env.DB_HOST,
		dialect: 'mysql',
		timezone: '+01:00',
		pool: {
		max: 150,
		min: 0,
		idle: 5000
		},
		logging: msg => Logger.log(2, msg)
	});


var sequelize_v1 = new Sequelize(
	"shops", 
	process.env.DB_USER, 
	process.env.DB_PASS, {
		host: process.env.DB_HOST,
		dialect: 'mysql',
		timezone: '+01:00',
		pool: {
		max: 150,
		min: 0,
		idle: 5000
		},
		logging: msg => Logger.log(2, msg)
	});

module.exports = {
    connection: sequelize
};
