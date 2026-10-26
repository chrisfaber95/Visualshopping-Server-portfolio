const Logger = require('../config/logging.js')
require('dotenv').config();


const  jwt  =  require('jsonwebtoken');

const sign_token = async (user, duration = '20h') => {
    var email = user.email
    const token = jwt.sign(
        { 
            user_id: user.user_id, 
            email: email 
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: duration,
        })
    user.accessToken = token
    user.save()
    return token
}

const hash_password = async (user) => {

}

module.exports = {
    sign_token
};
