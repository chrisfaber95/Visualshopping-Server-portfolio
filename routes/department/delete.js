const {Department, Product}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
	console.log(req)
	try {
        var info = req.query
		console.log(info)
		Department.destroy({
			paranoid: false,
            where: {
                department_id: info.department_id
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
