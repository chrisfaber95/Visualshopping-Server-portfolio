const {Productinformation}= require('../../models/index');
const { Op } = require("sequelize");

module.exports = (req, res) => {
	try {
        let products = req.body
		Productinformation.bulkCreate(products,{
			logging: false,
			paranoid: false,  
			updateOnDuplicate: ["variant", "title", "url", "dataproduct", "datasyndyproductid", "omschrijving", "imgurl"]
		})
		.then((user) => {
			res.status(200).json( "nice" );
		})
		.catch((err) =>{        
			Logger.log(1, err)
			res.status(200).json( {err: err_message });
		})
    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: error });
    }

};
