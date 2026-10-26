const {CustomerHasSpaaractie, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    var acties = req.body.spaaracties
    var details = req.body.details
Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body)) 
try{
    CustomerHasSpaaractie.findByPk(acties.customer_has_spaaractie_id, {
    })
    .then((user) => {
        user.increment({
            stamp_amount: -details.aantal
        })
        user.save()
        Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body) + '||' + JSON.stringify(user) + '||' + 'Boekje ingeleverd')
        res.status(200).json( {success: true, message: "Aantal zegels gewijzigd voor klant"} );
    })
    .catch((err) => {
        Logger.log(1, err)
        res.status(200).json( {success: false, message: "Kon aantal niet wijzigen."} );
    })
}
catch(error){
    res.status(200).json( {error: error} );
    Logger.log(1, error)
}
};
