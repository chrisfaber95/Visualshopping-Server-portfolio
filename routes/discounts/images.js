const db = require('../../config/connection');
const Logger = require('../../config/logging.js')
const multer = require("multer")

module.exports = (req, res) => {
    try {
		if (!req.files) {
			return res.status(200).send({ msg: "file is not found" })
		}
		req.files.forEach(element => {			
			var query = `call addImages('${element.path}', '${element.originalname}','${element.mimetype}', @LID); select @LID as images_id;`

			db.connection.query(query, function (err, result){
				if(err) throw err;
				
				/*var cart = JSON.parse(req.body.cart)
				var sqlquery1 = ""
				insertId = result[1][0].order_id
				for (var item in cart) {
					sqlquery1 += "call addOrderProduct "
					sqlquery1 += "(" + insertId + ", " + cart[item].product_id + ", '" + parseInt(cart[item].amount) + "', " + cart[item].price + "); "
					
				}
				db.connection.query(sqlquery1, function (err, result){
					if(err) throw err;
					const newOrder = result;
					res.status(200).send({ 
						"docs":  payment,
						"order": newOrder,
						"success": true
					});
				})*/
				console.log(result)
			})
		});

		res.status(200).send("uploaded") 
			// accessing the file
		//const myFile = req.files;
		console.log(req.files)
		//  mv() method places the file inside public directory
		//myFile.mv(`${__dirname}/public/sales/${myFile.name}`, function (err) {
		//	if (err) {
		//		console.log(err)
		//		return res.status(500).send({ msg: "Error occured" });
		//	}
		//	// returing the response with file path and name
		//	return res.send({name: myFile.name, path: `/${myFile.name}`});
		//});
    } catch (err) {
        Logger.log(1, err)
        console.error(err)
    }
}; 
 