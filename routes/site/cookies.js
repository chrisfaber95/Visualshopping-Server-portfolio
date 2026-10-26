const {Cookies, Order}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    try {
        Cookies.create({
            device: req.headers['user-agent'],
            user_auth: req.headers['authorization'],
            cookie_type: '1',
            ip: req.body.ip,
            customer_id: req.body.customer_id
        })
        .then((cookie) => { 
            res.status(200).json({ message:  "cookie accepted" })
        })
        .catch((error) =>{
            res.status(200).json({ err: error })
        })
    } catch (error) {
        res.status(200).json({ err: error })
    }
};