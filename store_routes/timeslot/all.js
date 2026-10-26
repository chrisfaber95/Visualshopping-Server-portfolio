const {Timeslots, Shop}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var where = {}
    Timeslots.findAll({
        logging: false,
        where: where,
        include: [
            {
                model: Shop,
                as: 'shop'
            }
            ],
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{        
        Logger.log(1, err)
        res.status(400).json( err );
    })
}