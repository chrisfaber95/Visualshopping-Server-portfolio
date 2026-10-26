const {User}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    User.findByPk(req.params.userId, {     
        include: [User.Userrole]
    })
    .then((user) => {
        res.status(200).json({ user });
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};