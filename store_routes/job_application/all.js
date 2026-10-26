const {JobApplication}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    JobApplication.findAll({
        logging: false
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{        
        Logger.log(1, err)
        res.status(400).json( err );
    })
}
