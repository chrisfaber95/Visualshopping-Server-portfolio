const db = require('../../config/connection');

module.exports = (req, res) => {

    var sqlquery = `
			SELECT user_id, email, password, cardnumber, role_id FROM User
			WHERE user_id = ${db.connection.escape(req.params.userId)}
			LIMIT 1;
		`
	db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const user = result;
        res.status(200).json({user});
	})   
};
