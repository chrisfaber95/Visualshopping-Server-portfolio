const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "UPDATE Messages_has_Users` as `ms` SET `ms`.`isOpened` = " + req.body.isOpened + " WHERE `ms`.`message_id` = " + req.params.messageId + ";";
		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const message = result;
        res.status(200).json({message});
	})   
};
