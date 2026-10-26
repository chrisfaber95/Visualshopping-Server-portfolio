const {User}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    try {
        let user = req.body.user
        if (user.hasOwnProperty('password')){
            bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            User.update(user,
                {
                    where: {user_id: user.user_id},
                })
                .then((user) => {
                    res.status(200).json( user );
                })
                .catch((err) =>{        
                    Logger.log(1, err)
                })
            })
        }
        else{
            User.update(user,
            {
                where: {user_id: user.user_id},
            })
            .then((user) => {
                res.status(200).json( user );
            })
            .catch((err) =>{        
                Logger.log(1, err)
            })
        }
    } catch (error) {        
        Logger.log(1, error)
    }
    
};