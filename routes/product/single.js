const db = require('../../config/connection');

module.exports = (req, res) => {
    var sqlquery = "SELECT p.* "
    sqlquery += "FROM `productView` as p WHERE p.ean = " + db.connection.escape(req.params.productId) + "; "

    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        const docs = result;
        res.status(200).json({ docs });
    })
};
