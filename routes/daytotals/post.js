const db = require('../../config/connection');
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

require('dotenv').config();

module.exports = (req, res) => {
	console.log(req.body)
		let total = req.body.total_revenue
		let user = req.body.picker
        let date = req.body.date
		var sqlquery = "call addDayTotal( "
			sqlquery += db.connection.escape(total) + ", "
			sqlquery += db.connection.escape(user) + ","
			sqlquery += db.connection.escape(date) + ","
			sqlquery += "NOW()"
			sqlquery += ');'
			console.log(sqlquery)
			
	   db.connection.query(sqlquery, function (err, result){
			if(err) throw err;
			res.status(200).send({ 
					"docs":  result,
					"success": true
			});
		})
};

	
