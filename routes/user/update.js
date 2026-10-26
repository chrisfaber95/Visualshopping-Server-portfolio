const db = require('../../config/connection');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    updateUser(req.body)

    var sqlquery = "SELECT * FROM `User` "
        sqlquery += "WHERE `user_id` = " + req.params.userId +";";
    db.connection.query(sqlquery, function (err, result){
    if(err) throw err;
    const user = result;
    res.status(200).json({user});
})   
}


const updateUser = (info, cb) => {
    console.log(info)
	sqlquery = "CALL updateUser('"+info.email+"', '"+info.name+"', '"+info.nfc_token+"', '"+info.nfc_serial+"', '"+info.user_id+"');"
    console.log(sqlquery)    
    db.connection.query(sqlquery, function (err, result3){
        if(err) throw err;
    })
}