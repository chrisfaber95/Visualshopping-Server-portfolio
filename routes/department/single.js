const db = require('../../config/connection');

module.exports = (req, res) => {
		var sqlquery = "SELECT i.`information_id` as `iId`, i.`text` as `iText`, i.`page` as `iPage`, s.`subonderdeel_id` as `sId` "
			sqlquery += "FROM `Information` as i "
			sqlquery += "LEFT JOIN `Subonderdeel` as s using (subonderdeel_id) "
			sqlquery += "WHERE s.`subonderdeel_id` = "+req.params.subId + ";";
		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const info = result;
        res.status(200).json({info});
	})   
};
