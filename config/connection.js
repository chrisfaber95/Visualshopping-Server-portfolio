const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
    database: process.env.DB_NAME,
	multipleStatements: true,
    insecureAuth : true
})
/*
server password: f3aKLoHK
server root password: f8bKLoHK

connection.connect(function(err){
	if (err) throw err;
	console.log("connected to Database");
});
*/
module.exports = {
    connection: connection
};
