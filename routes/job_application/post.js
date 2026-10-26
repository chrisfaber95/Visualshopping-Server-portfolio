const {Jobapplicaton}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    Joboffer.create(user)
    .then((user) => {
        delete user.password
        Logger.log(2, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body)) 
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