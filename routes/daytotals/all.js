const {Daytotals, User}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Daytotals.findAll({     
        logging: false,    
        where: req.body,
        include:{
            all: true
        }
    })
    .then((totals) => {
        res.status(200).json( totals );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};
