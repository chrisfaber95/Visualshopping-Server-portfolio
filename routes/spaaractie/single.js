const {Spaaractie}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Spaaractie.findByPk(req.params.actieId, {          
        logging: false
    })
    .then((actie) => {
        res.status(200).json({ actie });
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};