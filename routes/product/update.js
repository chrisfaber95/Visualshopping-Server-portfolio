const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "UPDATE `Product` SET "
    sqlquery += "`beschikbaar` = " + req.body.beschikbaar + ", "
    sqlquery += "`price` = '" + req.body.price + "', "
    sqlquery += "`end_of_life` = " + req.body.end_of_life + ", "
    sqlquery += "`stock` = " + req.body.stock + " "
    sqlquery += "WHERE `ean` = '" + req.body.ean + "'; "
    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        else {
            if (result != null) {
                const docs = "product updated";
                res.status(200).json({ docs });
            }
        }
    })
};