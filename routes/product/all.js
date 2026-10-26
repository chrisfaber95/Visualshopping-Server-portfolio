const db = require('../../config/connection');
const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
    try {
        if (req.query.dep) {
            if (req.query.app) {
                var sqlquery = "SELECT * "
                sqlquery += "FROM `productView` as p WHERE p.categoryname1 = '" + req.query.dep + "' and p.schaphoogte = " + req.query.row + " and p.beschikbaar >= " + req.query.app + " ORDER BY `schapplaats` ASC; "
            } else {
                var sqlquery = "SELECT * "
                sqlquery += "FROM `productView` as p WHERE p.categoryname1 = '" + req.query.dep + "' and p.schaphoogte = " + req.query.row + " ORDER BY `schapplaats` ASC; "
            }
        } else {
            if (req.query.app) {
                var sqlquery = "SELECT * "
                sqlquery += "FROM `productView` as p WHERE p.schaphoogte = " + req.query.row + " and p.beschikbaar = " + req.query.app + " ORDER BY `schapplaats` ASC; "
            } else {
                var sqlquery = "SELECT * "
                sqlquery += "FROM `productView` as p;"
            }
        }
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