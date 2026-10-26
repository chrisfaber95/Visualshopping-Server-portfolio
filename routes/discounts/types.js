const {DiscountType}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    DiscountType.findAll({    
        logging: false,    
        where: req.query
        //exclude:  [Product] 
    })
    .then((discounts) => {
        res.status(200).json( discounts );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};