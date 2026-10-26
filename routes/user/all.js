const {User}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let where = req.query
    User.findAll({      
        logging: false,   
        where: where,
        include: {
            all: true
        },
        attributes: {
            include: ['nfc_token']
        }
    })
    .then((user) => {
        res.status(200).json( user );
    })
    .catch((err) =>{       
        res.status(400).json( err ); 
        Logger.log(1, err)
    })
};