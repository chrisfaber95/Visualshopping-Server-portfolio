const {Business_Hours}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
	try {
        var info = req.query
		Business_Hours.destroy({
			paranoid: false,
            where: {
                business_hours_id: info.business_hours_id
            }
		})
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) =>{        
			Logger.log(1, err)
			res.status(200).json( {err: err });
		})
    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: error });
    }

};
