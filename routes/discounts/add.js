const {Discounts,ProductHasDiscount, Product}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var discount = req.body.discounts
    Discounts.create(discount,{    
        include: [
            {
                model: ProductHasDiscount,
                as: 'product_discount_list'
            }
        ]
        //exclude:  [Product] 
    })
    .then((discounts) => {
        res.status(200).json( discounts );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};