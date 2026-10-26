const {ActieOrder, ActieOrderHasProduct, Product, CustomerHasSpaaractie}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const mailing = require('../../config/mailing.js')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);



const sendOrderMail = async function(info1) {
    console.log(info1)
    const options = await mailing.setMailOptions(
        info1.actie_order_information.customerEmail,
        mailing.actiePickedTemplate(cryptr.encrypt(info1.actie_order_id), info1),
        cryptr.encrypt(info1.actie_order_id))
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

const updateStamps = async function(order){
    if(order.customer_id){
        var id = order.customer_id
        CustomerHasSpaaractie.findAll({         
            where: {customer_id: id},
            include: { all: true}
        })
        .then((user) => {

            CustomerHasSpaaractie.increment({
                stamp_amount: Math.floor(order.finalPrice / user[0].spaaractie.stamp_price)
            },
            { 
                where: { 
                    customer_has_spaaractie_id: user[0].customer_has_spaaractie_id
                } 
            })
            .then((acties) => {
                console.log(acties)
            })
            .catch((err) =>{        
                Logger.log(1, err)
            })
        })
        .catch((err) =>{        
            Logger.log(1, err)
        })
       
    }
}

module.exports = async (req, res) => {
    if (req.params.orderId) {
        var order;

        switch (req.body.type) {
            case "Product":
                order = req.body.order;
                try {
                ActieOrderHasProduct.create({
                    amount: product.amount,
                    discounted_price: product.discounted_price,
                    order_id: product.order_id,
                    picked: product.picked,
                    price: product.price,
                    product_id: product.product_id,
                    reason_return: product.reason_return,
                    returned: product.returned,
                    stamps_amount: product.stamps_amount
                })
                
                    const result = await ActieOrder.findByPk(order.actie_order_id, {
                      include: [
                        { all: true},
                        {model: ActieOrderHasProduct, 
                            as: "product_list", 
                            include: [
                                {
                                    model: Product, 
                                    as: "product", 
                                    include: [{
                                        model: Productinformation,
                                            as: 'product_information',
                                            required: false,
                                            include: [
                                                {
                                                    model: ProductAdditionInformation,
                                                    as: 'product_additional_information_list'
                                                }
                                        ]  
                                    }]
                                },
                                {
                                    model: actieOrderProductHasVariant, 
                                    as: "actie_order_product_variant_list", 
                                    include: [{
                                        model: ProductVariant,
                                        as: 'product_variant'
                                    }]
                                }
                            ]
                        },
                        {model: OrderInformation, 
                            as: "order_information",
                            paranoid: false,
                            include: [{
                                model: Customer, 
                                as: "customer",
                                attributes: {exclude: ['password', 'accessToken', 'resetToken', 'createdAt', 'updatedAt', 'deletedAt']}
                            }]
                        }
                    ]
                    });
                  
                        res.status(200).send(result);
                  } catch (err) {
                    Logger.log(1, err);
                    res.status(400).send(err);
                  }
                break;
            case "Update":
                try {
                    const order = req.body.order;
                    var items = order.product_list
                ActieOrderHasProduct.bulkCreate(items,{
                    logging: false,
                    paranoid: false,
                    updateOnDuplicate: ["amount", "price", "picked", "reason_return", "returned", "stamps_amount"]
                });

                const updatedOrder = await ActieOrder.update(order, {
                    where: { actie_order_id: order.actie_order_id },
                    include: [{ association: "product_list" }],
                    returning: true
                  });

                  if (order.status === "picked") {
                    sendOrderMail(order);
                  }
                
                  if (order.status === "afgehaald") {
                    updateStamps(order);
                  }
                  Logger.log(2, `${order} || ${req.headers}`);
                  res.status(200).json(order);
                } catch (err) {
                  Logger.log(1, err);
                  res.status(400).send(err);
                }
                break;

            /*    var product = req.body.product
                console.log(product)
                OrderHasProduct.create({
                    amount: product.amount,
                    discounted_price: product.discounted_price,
                    order_id: product.order_id,
                    picked: product.picked,
                    price: product.price,
                    product_id: product.product_id,
                    reason_return: product.reason_return,
                    returned: product.returned,
                })
                .then((result) => {
                    Order.findByPk(req.params.orderId, {      
                        include: [{ all: true,}, {model: OrderHasProduct, as: "product_list", include: [{model: Product, as: "product"}]}]
                    })
                    .then((result) => {
                        res.status(200).send(result);
                    })
                    .catch((err) =>{        
                        Logger.log(1, err)
                        console.error(err)
                    })
                })
                break;*/
            default: break;
        }

        
    }
};

/*const db = require('../../config/connection');
const mailing = require('../../config/mailing.js')
const Logger = require('../../config/logging.js')
require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

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
}*/
