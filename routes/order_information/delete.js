const {OrderInformation}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    try {
        var info = req.body
		OrderInformation.destroy({
            logging: true,
            paranoid: true,
            where: {
                order_information_id: info.order_information_id
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