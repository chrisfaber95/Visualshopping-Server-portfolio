const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "SELECT * FROM orderProductList where `order_id` = " + req.params.orderId + "; "

		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		const docs = result;
        res.status(200).json({docs});
	})   
};

