const {JobOffer, Shop, Information, Address, Socials, Business_Hours}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var where = req.query
    Shop.findAll({        
        logging: false,
        where: where,
        include: [
            {
                model: Information,
                as: 'information',
                include:[{
                    model: Address,
                    as: 'address'
                }]
            },
            {
                model: Socials,
                as: 'socials'
            },
            {
                model: Business_Hours,
                as: 'business_hours'
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