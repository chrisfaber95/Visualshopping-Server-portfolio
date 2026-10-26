 const db = require('../../config/connection');
const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
    try {
             var sqlquery = `SELECT * 
             			FROM discount;`

        
        db.connection.query(sqlquery, function(err, result) {
            if (err) {
                Logger.log(1, err)
                console.error(err)
            } else {
                const docs = result;
                res.status(200).json({ docs })
            }
        })
    } catch (err) {
        Logger.log(1, err)
        console.error(err)
    }
}; 
