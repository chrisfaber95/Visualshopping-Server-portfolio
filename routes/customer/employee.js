const {Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let where = req.query
    Customer.findOne({
        logging: false,
        where: where,
        attributes: {exclude: ['password', 'accessToken', 'resetToken', 'createdAt', 'updatedAt', 'deletedAt', 'resettoken']}
    })
    .then((user) => {
        res.status(200).json( user );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};