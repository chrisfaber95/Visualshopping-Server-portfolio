const { User } = require('../../models/index');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

const auth = require('../../config/authentication.js');
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    let email = req.body.email || null;
    const hash = req.body.password || null;
    const tag = req.body.tag || null;
    const serial = req.body.serial || null;
    if(email) email = email.toLowerCase()
    try{ 
        if (!(email && hash) && !(tag, serial)) {
            res.status(200).send({err:"Alle velden moeten zijn ingevuld."}) 
            return
        }
        let where = {}
        if(email) {
            where[Op.or] = []
            where[Op.or].push({"email": email})
            where[Op.or].push({"cardnumber": email})
        }
        else if(tag){
            where.nfcToken = tag
            where.nfcSerial = serial
        }  
        User.findOne({
            where: where,
            include: [User.Userrole],
            attributes: {include: ['password', 'accessToken']}
        })
        .then((user) => {
            if (user) {	
                bcrypt.compare(hash, user.password)
                .then((result)=>{
                    if(result){
                        auth.sign_token(user)
                        .then(() => {
                            var send_user = user.dataValues
                            delete send_user.password
                            delete send_user.id
                            res.status(200).json({user: send_user});
                        })
                    }
                    else{
                        Logger.log(1, "Invalid Credentials" + JSON.stringify(req.headers))
                        res.status(200).send({err:"Verkeerde gegevens ingevoerd"})
                    }
                })
            }
            else{
                Logger.log(1, "Invalid Credentials" + JSON.stringify(req.headers))
                res.status(200).send({err:"Verkeerde gegevens ingevoerd"})
            }
        })
    } catch (err) {
        Logger.log(1, "Something went wrong" + JSON.stringify(req.headers))
        res.status(200).send({err:"Iets ging verkeerd, probeer opnieuw of later."})
    }
};
