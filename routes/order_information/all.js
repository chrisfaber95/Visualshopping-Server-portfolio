const {OrderInformation, Order, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    OrderInformation.findAll({   
        logging: false,      
        where: req.query,
        include: [
            {
                model: Customer,
                as: 'customer'
            }
        ],
        exclude: [{
            model: Order
        }]
       
    })
    .then((order_information) => {
        res.status(200).json( order_information );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};