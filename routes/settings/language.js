const db = require('../../config/connection');

module.exports = (req, res) => {
   
    var sqlquery = "SELECT * "
    	 sqlquery += "FROM `bollegraafdb`.`Language` "

		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const language = result;
        res.status(200).json({language});
	})   
};
