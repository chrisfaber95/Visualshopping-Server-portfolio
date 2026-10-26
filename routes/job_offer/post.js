const {Joboffer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var user = req.body.joboffer
    Joboffer.create(user)
    .then((user) => {
        res.status(200).json( user );
    })
    .catch((err) =>{        
        Logger.log(1, err)
        let err_message = "De volgende velden bestaan al: "
        for(field in err.fields){
            err_message += field.toString()
        }
        res.status(200).json( {err: err_message });
    })
};
