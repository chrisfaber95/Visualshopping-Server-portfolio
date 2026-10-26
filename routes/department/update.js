const db = require('../../config/connection');

module.exports = (req, res) => {
    if(req.params.infoId == 0){
      sqlquery = "INSERT INTO `Information` (`page`, `subonderdeel_id`, `text`) VALUES ("+req.body.iPage + ", "+req.body.sId+ ", '"+req.body.iText+"');"
    }
    else{
      sqlquery = "UPDATE `Information` SET `text`= '" + req.body.iText + "' , `page`= '" + req.body.iPage + "' WHERE `information_id`= " + req.params.infoId + ";"
    }
    db.connection.query(sqlquery, function (err, result3){
		if(err) throw err;
		const info = result3;
        res.status(200).json({info});
	})   
};
