const {CustomerHasSpaaractie, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    var userinfo = req.body.params.info
    var amount_of_stamps = req.body.params.info.amount_exchange || Math.floor(userinfo.storepoints / user[0].spaaractie.point_for_stamp)

    

    CustomerHasSpaaractie.findAll({    
        //logging: false,     
        where: req.body.params.where,
        include: { all: true}
    })
    .then((user) => {
        if(user.length == 0){
            CustomerHasSpaaractie.create({
                spaaractie_id: userinfo.spaaractie_id,
                customer_id: userinfo.customer_id,
                stamp_amount: userinfo.amount_exchange
            })
            .then((actie) => {
                Logger.log(3, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body) + '||'+ JSON.stringify(actie))
                
                res.status(200).json( actie );
            })
            .catch((err) =>{        
                Logger.log(1, err)                
                res.status(200).json( err );
            })
        }
        else{
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
        }
       /* if(amount_of_stamps > Math.floor(userinfo.storepoints / user[0].spaaractie.point_for_stamp)){
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
        }      */
    })
    .catch((err) =>{        
        Logger.log(1, err)
        res.status(200).json( err );
    })
    
};