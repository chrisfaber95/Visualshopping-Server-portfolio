const {Customer, CustomerSettings, CustomerInformation}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Customer.findByPk(req.query.customer_id, {  
        logging: false,
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
        res.status(200).json({ user });
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};