const db = require('../../config/connection');

module.exports = (req, res) => {
    console.log(req)
    var message = "cookie accepted"
    var sqlquery = ` INSERT INTO Cookies 
			(device, acceptance_date, user_auth, cookie_type, ip) 
			VALUES (${db.connection.escape(req.headers['user-agent'])}, NOW(), ${db.connection.escape(req.headers['authorization'])}, '1', ${db.connection.escape(req.body.ip)});
		`
    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        const message = result;
        res.status(200).json({ message })
    })
};