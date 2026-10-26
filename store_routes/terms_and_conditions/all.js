const {Terms_And_Conditions}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var where = req.query
    Terms_And_Conditions.findAll({        
        logging: false,   
        where: where
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{        
        Logger.log(1, err)
        res.status(400).json( err );
    })
}