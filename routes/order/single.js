const db = require('../../config/connection');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

module.exports = (req, res) => {
    var mystr;
    if (req.params.orderId.length > 40) {
        mystr = cryptr.decrypt(req.params.orderId);
    } else {
        mystr = req.params.orderId
    }
    var sqlquery = "SELECT o.* "
    sqlquery += "FROM `ordersView` as o WHERE o.order_id = '" + mystr + "'; "

    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        const docs = result;
        res.status(200).json({ docs });
    })
};