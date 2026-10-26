const db = require('../../config/connection');

const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
    var sqlquery = ''
    var auth = `SELECT count(*) as 'auth' FROM User WHERE User.access_token = ${db.connection.escape(req.headers.authorization)} and (User.role_id = 1 or User.role_id = 2)`
    var auth = `SELECT count(*) as 'auth' FROM User WHERE (User.role_id = 1 or User.role_id = 2)`

    db.connection.query(auth, function(err, result) {
        if (err){
			Logger.log(1, err)
			return  res.status(500).send("Server error!")			
		}
        if (result[0]['auth'] > 1) {
            sqlquery = `SELECT * FROM employersView`
        } else {
            sqlquery = `SELECT * FROM employersView LIMIT 0`
        }
        db.connection.query(sqlquery, function(err, result) {
            if (err) throw err;
            const user = result;
			Logger.log(2, user)
            res.status(200).json({ user });
        })
    })
};