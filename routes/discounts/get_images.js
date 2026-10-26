const db = require('../../config/connection');
const Logger = require('../../config/logging.js')
var request = require('request');
const fs = require("fs");

module.exports = (req, res) => {
    if(req.params.imgId){
        try {
            var sqlquery = `SELECT * FROM Images where images_id = ${req.params.imgId};`            
            db.connection.query(sqlquery, (err, result) =>{
                if (err) {
                    Logger.log(1, err)
                } else {
                    res.setHeader('content-type', 'image/jpeg');
                    var s = fs.readFileSync(result[0].path);
                    var string = Buffer.from(s).toString('base64')
                    
                    res.status(200).send(string) 
                }
            })
        } catch (err) {
            Logger.log(1, err)
        }
    }
    else{
        var sqlquery = `SELECT * 
                        FROM Images;`            
            db.connection.query(sqlquery, (err, result) =>{
                if (err) {
                    Logger.log(1, err)
                } else {
                    res.send(200, result)
                }
            })
    }
    
}; 
