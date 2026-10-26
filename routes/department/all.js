const {Department, Product}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Department.findAll({      
        logging: false,
        where: req.query
    })
    .then((department) => {
        res.status(200).json( department );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};