const {CustomerHasSpaaractie}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {   
    CustomerHasSpaaractie.findAll({  
        logging: false,       
        where: req.query,
        include: { all: true}
    })
    .then((user) => {
        console.log(user)
        res.status(200).json( user );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};
