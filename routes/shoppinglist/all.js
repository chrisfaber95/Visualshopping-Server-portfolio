const {ShoppingList, ShoppingListHasProduct, Product}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let where = {}
    if(req.query){
        where = req.query
    }
    ShoppingList.findAll({  
        logging: false,       
        where: where,
        include: [
            {
                model: ShoppingListHasProduct, 
                as: 'shoppinglist_products',
                include: [{
                    model: Product,
                    as: 'product',
                    include:[
                        Product.Productinformation
                    ]
                }]
            }
        ],
        attributes: {
            exclude: ['customer_id']
        }
    })
    .then((actie) => {
        res.status(200).json( actie );
    })
    .catch((err) =>{     
        console.log(err)   
        Logger.log(1, err)
    })
};