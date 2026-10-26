const {Customer, CustomerSettings, CustomerInformation}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let where = req.query
    if(req.query.accessToken && req.query.customer_id){
        Customer.findAll({
            logging: false,
            where: where,
            include: [{
                model: CustomerSettings,
                as: 'customer_settings',
                required: false
            },{
                model: CustomerInformation,
                as: 'customer_information',
                required: false
            }],
            attributes: {exclude: ['password', 'accessToken', 'resetToken', 'createdAt', 'updatedAt', 'deletedAt']}
        })
        .then((user) => {
            res.status(200).json( user );
        })
        .catch((err) =>{        
            Logger.log(1, err)
        })
    }
    else{
        res.status(200).json("No Auth");
    }
};