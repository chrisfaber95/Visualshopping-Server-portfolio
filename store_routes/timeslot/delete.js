const {Timeslots}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
	try {
        var info = req.query
		Timeslots.destroy({
			paranoid: false,
            where: {
                timeslot_id: info.timeslot_id
            }
		})
		.then((user) => {
			res.status(200).json( "nice" );
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
