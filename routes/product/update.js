const {Product}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let product = req.body
    Product.update(product,
    {
        logging: false, 
        where: {id: product.id}
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
}