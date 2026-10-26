const {Userrole}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Userrole.findAll({   
        logging: false,      
        where: req.query
    })
    .then((userroles) => {
        res.status(200).json( userroles );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};