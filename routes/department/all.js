const db = require('../../config/connection');

module.exports = (req, res) => {
	if(req.query.dep){    
		var sqlquery = "SELECT d.* "
			sqlquery += "FROM `Department` as d WHERE d.mainlabel = '" + req.query.dep + "'; "
	}
	else{
		var sqlquery = "SELECT d.department_id, d.label, d.name, d.slug, d.main_department "
			sqlquery += "FROM `Department` as d; "
	}
		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const docs = result;
        res.status(200).json({docs});
	})   
};

