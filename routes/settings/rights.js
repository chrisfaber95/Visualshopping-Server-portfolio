const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "SELECT * "
    	 sqlquery += "FROM `Userroles` "

		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const rights = result;
        res.status(200).json({rights});
	})   
};
