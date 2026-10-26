const db = require('../../config/connection');

module.exports = (req, res) => {
   
    var sqlquery = "SELECT m.`id` as `mId`, m.`date` as `mDate`, m.`content` as `mContent`, m.`subject` as `mSubject`, "
    	sqlquery += "mu.`isOpened`, toU.`id` as `toId`, fromU.`id` as `fromId`, toUi.`name` as `toName`, fromUi.`name` as `fromName`, toUi.`Surname` as `toSurname`, fromUi.`Surname` as `fromSurname` "
        sqlquery += "FROM `bollegraafdb`.`Messages` as m "
		sqlquery += "JOIN `bollegraafdb`.`Messages_has_Users` as mu ON mu.`Messages_id` = m.`id` "
		sqlquery += "JOIN `bollegraafdb`.`Users` as toU ON toU.`id` = mu.`Users_id1` "
		sqlquery += "JOIN `bollegraafdb`.`Users` as fromU ON fromU.`id` = mu.`Users_id_sender` "
		sqlquery += "JOIN `bollegraafdb`.`Userinfo` as toUi ON toUi.`id` = toU.`Userinfo_id` "
		sqlquery += "JOIN `bollegraafdb`.`Userinfo` as fromUi ON fromUi.`id` = fromU.`Userinfo_id` "
		sqlquery += "WHERE toU.`id` = " + req.params.userId +";"

		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const message = result;
        res.status(200).json({message});
	})   
};
