const {Daytotals}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

require('dotenv').config();

module.exports = (req, res) => {
	
	Daytotals.upsert({
		daytotals_id: req.body.daytotal_id,
		date: req.body.date,
		user: req.body.user_id
	})

		let total = req.body.total_revenue
		let user = req.body.picker
        let date = req.body.date
		var sqlquery = "call addDayTotal( "
			sqlquery += db.connection.escape(total) + ", "
			sqlquery += db.connection.escape(user) + ","
			sqlquery += db.connection.escape(date) + ","
			sqlquery += "NOW()"
			sqlquery += ');'
			
	   db.connection.query(sqlquery, function (err, result){
			if(err) throw err;
			res.status(200).send({ 
					"docs":  result,
					"success": true
			});
		})
};

	
