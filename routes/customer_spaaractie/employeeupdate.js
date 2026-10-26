const {CustomerHasSpaaractie, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    var acties = req.body.spaaracties
    var customer = req.body.customer_id
    var details = req.body.details
Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body)) 
try{
    for(var a in acties){
console.log(a)
    const index = a
        CustomerHasSpaaractie.findOne({
            where:{
                spaaractie_id: acties[index].spaaractie_id,
                customer_id: customer
            }
        })
        .then((user) => {
            if(user === null){
                CustomerHasSpaaractie.create({
                    spaaractie_id: acties[index].spaaractie_id,
                    customer_id: customer,
                    stamp_amount: acties[index].aantal
                })
                .then((actie) => {
                    Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body) + '||'+ JSON.stringify(actie))
                })
            }
            else{
                user.increment({
                    stamp_amount: acties[index].aantal
                })
                user.save()
                Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body) + '||' + JSON.stringify(user))
            }
        })
        .catch((err) => {
            Logger.log(1, err)
        })
    }
    Customer.findByPk(customer, {  
    })
    .then((customer1) => {
        customer1.increment({
            storepoints: details.munten
        })
        Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(customer)+ '||' + JSON.stringify(req.body))
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
    res.status(200).json( {success: true, message: "Zegels toegevoegd"} );
}
catch(error){
    res.status(200).json( {error: error} );
    Logger.log(1, error)
}
    
    /*var userinfo = req.body.params.info
    var amount_of_stamps = req.body.params.info.amount_exchange || Math.floor(userinfo.storepoints / user[0].spaaractie.point_for_stamp)

    

    CustomerHasSpaaractie.findAll({    
        logging: false,     
        where: req.body.params.where,
        include: { all: true}
    })
    .then((user) => {
        if(amount_of_stamps > Math.floor(userinfo.storepoints / user[0].spaaractie.point_for_stamp)){
            res.status(200).json( {error: "Teveel zegels ingevoerd."} );
        }
        else{
            CustomerHasSpaaractie.increment({
                stamp_amount: amount_of_stamps
            },
            { 
                where: { 
                    customer_has_spaaractie_id: user[0].customer_has_spaaractie_id
                } 
            })
            .then((acties) => {
                Customer.increment({
                    storepoints: -(amount_of_stamps * user[0].spaaractie.point_for_stamp)
                },
                { 
                    where: { 
                        customer_id: userinfo.customer_id,
                        accessToken: userinfo.accessToken
                    } 
                })
                .then((acties) => {
                    res.status(200).json( acties );
                })
            })
            .catch((err) =>{        
                Logger.log(1, err)
                res.status(200).json( err );
            })
        }      
    })
    .catch((err) =>{        
        Logger.log(1, err)
        res.status(200).json( err );
    })
    */
};
