const db = require('../../config/connection');
const mailing = require('../../config/mailing.js')
const Logger = require('../../config/logging.js')
require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var fs = require('fs');

module.exports = (req, res) => {
    if (req.params.orderId) {
        switch (req.body.type) {
            case "Product":
            var sqlquery = ""
			    sqlquery += "call addOrderProduct "
				sqlquery += "(" + req.params.orderId + ", " + req.body.product_id + ", '" + req.body.amount + "', " + req.body.price + "); ";
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Bag added Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers) + "|" + JSON.stringify(req.body))
                        res.status(200).send({
                            "docs": result
                        });
                    }
                })
                break;
            case "Update":
                var sqlquery = ""
                var total = parseFloat(0.00).toFixed(2)
                var items = req.body.items
                var orderinfo = req.body.order
                for (var i = 0; i < req.body.items.length; i++) {
                    if (items[i].picked < -100) {
                        sqlquery += "UPDATE `cooplubbers`.`Product` SET `beschikbaar` = '" + req.body.items[i].picked + "' where `product_id` = " + req.body.items[i].product_id + "; "
                    } else if (items[i].picked >= 0) {
                        total = parseFloat(parseFloat(total) + (parseFloat(items[i].price) * parseFloat(items[i].picked))).toFixed(2)
                    }
                }
                for (var i = 0; i < req.body.items.length; i++) {
					var reason_return = req.body.items[i].reason_return || 0
                    sqlquery += "UPDATE `cooplubbers`.`Order_has_Product` SET `picked` = '" + req.body.items[i].picked + "', `returned` = '" + req.body.items[i].returned + "', `reason_return` = '" + reason_return + "' where `order_id` = " + req.body.items[i].order_id + " and `product_id` = " + req.body.items[i].product_id + "; "
                }
                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = '" + orderinfo.status + "', `winkelbon` = '" + orderinfo.winkelbon + "', `finalPrice` = '" + total + "', `pickingcrate` = '" + orderinfo.pickingcrate + "', `totalPrice` = '" + total +"', `picking_user` = '" + orderinfo.picking_user + "' where `order_id` = " + req.params.orderId + ";"

                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Update Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(200).send({
                            "docs": result
                        });
                    }
                })
                break;
            case "Verwerking":
                var sqlquery = ""
                var total = parseFloat(0.00).toFixed(2)
                var items = req.body.items
                var orderinfo = req.body.order
                var picker = req.body.picker
                for (var i = 0; i < items.length; i++) {
                    total = parseFloat(parseFloat(total) + (parseFloat(items[i].price) * parseFloat(items[i].picked))).toFixed(2)
                }
                for (var i = 0; i < req.body.items.length; i++) {
                    sqlquery += "UPDATE `cooplubbers`.`Order_has_Product` SET `picked` = '" + req.body.items[i].picked + "' where `order_id` = " + req.body.items[i].order_id + " and `product_id` = " + req.body.items[i].product_id + "; "
                }
                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = 'picked', `totalPrice` = '" + total + "', `picking_user` = '" + picker + "', `pickingtime` = NOW()  where `order_id` = " + req.params.orderId + ";"
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Verwerk Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers) + "| User:" + picker)
                        var order = {
                            totalPrice: orderinfo.finalPrice,
                            items: items
                        }
                        res.status(200).send({
                            "docs": order
                        });
                    }
                })
                break;

            case "Scanned":
                var sqlquery = ""
                var total = parseFloat(0.00).toFixed(2)
                var items = req.body.items
                var orderinfo = req.body.order
                var picker = req.body.picker
                for (var i = 0; i < items.length; i++) {
                    total = parseFloat(parseFloat(total) + (parseFloat(items[i].price) * parseFloat(items[i].picked))).toFixed(2)
                }
                for (var i = 0; i < req.body.items.length; i++) {
                    sqlquery += "UPDATE `cooplubbers`.`Order_has_Product` SET `picked` = '" + req.body.items[i].picked + "' where `order_id` = " + req.body.items[i].order_id + " and `product_id` = " + req.body.items[i].product_id + "; "
                }
                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = 'scanned', `totalPrice` = '" + total + "', `finalPrice` = '" + orderinfo.finalPrice + "', `scanning_user` = '" + picker + "', `winkelbon` = '" + orderinfo.winkelbon + "', `scanningtime` = '" + orderinfo.scanningtime + "' where `order_id` = " + req.params.orderId + ";"
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Scanned Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers) + "| User:" + picker)
                        var order = {
                            totalPrice: orderinfo.finalPrice,
                            items: items
                        }
                        sendOrderMail(req.body.order, order)
                        res.status(200).send({
                            "docs": order
                        });
                    }
                })
                break;
            case "Afgehaald":
                var sqlquery = ""
                var orderinfo = req.body.order

                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = 'afgehaald', `id_check` = " + orderinfo.id_check + ", `pickup_confirm` = " + orderinfo.pickup_confirm + ", `pickup_user` = " + orderinfo.pickup_user + ", `pickedup_time` = " + orderinfo.pickedup_time + " where `order_id` = " + req.params.orderId + ";"
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Afgehaald Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(200).send({
                            "docs": result
                        });
                    }
                })
                break;
            case "Storepayment":
                var picker = req.body.picker
                var sqlquery = ""
                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = 'payed', `paycode` = 'employee-" + picker + "-Storepayment' where `order_id` = " + req.params.orderId + ";"
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Storepayment Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(200).send({
                            "docs": result
                        });
                    }
                })
                break;
            case "Annuleren":
                var sqlquery = ""
                sqlquery += "UPDATE `cooplubbers`.`Order` SET `status` = 'rejected' where `order_id` = " + req.params.orderId + ";"
                db.connection.query(sqlquery, function(err, result) {
                    if (err) {
                        Logger.log(1, err + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(400).send();
                    } else {
                        Logger.log(2, "Geannuleerd Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
                        res.status(200).send({
                            "docs": result
                        });
                    }
                })
                break;
            default:
                var mystr = cryptr.decrypt(req.params.orderId);
                var sqlquery = "SELECT o.* "
                sqlquery += "FROM `ordersView` as o WHERE o.order_id = '" + mystr + "' "
                sqlquery += "Limit 1; "
                db.connection.query(sqlquery, function(err, result) {
                    if (err) throw err;
                    else {
                        if (result[0].status == 'scanned')
                            mollieClient.payments.create({
                                amount: {
                                    value: parseFloat(result[0].finalPrice).toFixed(2),
                                    currency: 'EUR'
                                },
                                description: 'Online bestelling Coop Lubbers',
                                redirectUrl: process.env.BASE_URL,
                                webhookUrl: process.env.MOLLIE_WEBHOOK,
                                method: 'ideal'
                            })
                            .then(payment => {
                                var sqlquery1 = "UPDATE `cooplubbers`.`Order` SET `paycode` = '" + payment.id + "' where `order_id` = " + result[0].order_id + ";"

                                db.connection.query(sqlquery1, function(err, result) {
                                    if (err) throw err;
                                    const newOrder = result;
                                    res.status(200).send({
                                        "docs": payment,
                                        "order": newOrder
                                    });
                                })
                            })
                    }
                })
                break;
        }

    } else {}
};

const sendOrderMail = async function(info1, order) {
    const options = await mailing.setMailOptions(
        info1.customerEmail,
        mailing.pickedTemplate(cryptr.encrypt(info1.order_id), order),
        cryptr.encrypt(info1.order_id))
    try {
        mailing.transporter.sendMail(options, function(error, info) {
            if (error) {
                Logger.log(1, error)
            } else {
                Logger.log(2, info.response)
            }
        });
    } catch (err) {
		Logger.log(1, err)
    }
}
