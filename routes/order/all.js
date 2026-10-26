const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "SELECT o.* "
    sqlquery += "FROM `Order` as o "
    if (req.params.date) {
        sqlquery += "where `pickupDate` like '%" + req.params.date + "%' and status != 'pending' "
        sqlquery += "ORDER BY `pickupTime` ASC; "
    } else {
        sqlquery += " where status != 'pending'  ORDER BY `pickupDate` DESC; "
    }
    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        const docs = result;
        res.status(200).json({ docs });
    })
};
