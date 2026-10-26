const {CustomerHasSpaaractie}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var customerId = req.params.customerId
    let where = {}
    where[Op.or] = []
    where[Op.or].push({"customer_id": customerId})
    CustomerHasSpaaractie.findAll({
        logging: false,
        where: where
    })
    .then((actie) => {
        res.status(200).json( actie );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};
