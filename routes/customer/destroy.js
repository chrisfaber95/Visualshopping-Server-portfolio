const {Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var now = true

    if(now) res.status(200).json( {err: 'No' });
    else{
    try {
        var info = req.body
		Customer.destroy({
            logging: true,
            where: {
                customer_id: info.user_id
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
}
};