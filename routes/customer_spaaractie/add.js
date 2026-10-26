
const {Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    try {
        let user = req.body
		bcrypt.hash(user.password, salt, (err, hash) => {
		user.password = hash
		if(err){			
			Logger.log(1, err)
		}
		Customer.create(user)
			.then((user) => {
				res.status(200).json( user );
			})
			.catch((err) =>{        
				Logger.log(1, err)
				let err_message = "De volgende velden bestaan al: "
				for(field in err.fields){
					err_message += field.toString()
				}
				res.status(200).json( {err: err_message });
			})
		})
    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: error });
    }
};