const {CustomerHasFavorite}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    try {
        var info = req.body
		CustomerHasFavorite.findOrCreate({
            logging: false,
            where:{
                customer_id: info.user_id,
                product_id: info.product_id
            }
        })
        .then((user) => {
            res.status(200).json( user );
        })
        .catch((err) =>{        
            Logger.log(1, err)
            res.status(200).json( {err: JSON.stringify(err) });
        })
    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: JSON.stringify(error) });
    }
    
};