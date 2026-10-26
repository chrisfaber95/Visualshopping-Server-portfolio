const jwt = require('jsonwebtoken');
const {User}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const user_id = decodedToken.user_id;
    User.findByPk(user_id, {    
      logging: console.log 
    })
    .then((user) => {
        if (user_id && user.user_id !== user_id && user.accessToken != token) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
    
  } catch(err) { 
    Logger.log(1, err)
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};