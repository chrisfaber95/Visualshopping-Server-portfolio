const db = require('../../config/connection');

module.exports = (req, res) => {
   
    var sqlquery = "SELECT * from `allMessages` "
		sqlquery += "WHERE `fromId` = " + req.params.userId +" OR `toId` = " + req.params.userId + ";"

		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;

		const message = result;
        res.status(200).json({message});
	})   
};

