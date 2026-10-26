const db = require('../../config/connection');
const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
	try{
		var sqlquery = "SELECT count('orders') as `ordercount`, o.`pickupTime` "
			sqlquery += "FROM `Order` as o where o.`pickupDate` like '" + req.params.date + "%' group BY o.`pickupTime`; "

			db.connection.query(sqlquery, function (err, result){
			if(err){
				Logger.log(1, err)
			}
			else{
				const ordercounter = result;
				res.status(200).json({ordercounter});
			}
		})   
	}
	catch(err){
		Logger.log(1, err)
	}
};

