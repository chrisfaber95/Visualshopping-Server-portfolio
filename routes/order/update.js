const {Order, OrderInformation, OrderHasProduct, Product, CustomerHasSpaaractie, Customer, Productinformation, ProductAdditionInformation, Discounts, ProductHasDiscount}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const mailing = require('../../config/mailing.js')
const upProduct = require('./updateFunctions/updateProducts')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);


const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

const sendOrderMail = async function(info1) {
   const options = await mailing.setMailOptions(
        info1.order_information.customerEmail,
        mailing.pickedTemplate(`order||${cryptr.encrypt(info1.uuid_id)}`, info1),
        `order||${cryptr.encrypt(info1.uuid_id)}`)
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
        order.spaarzegels.split(',').forEach(element => {  
            CustomerHasSpaaractie.findOrCreate({         
                where: {
                    customer_id: id,
                    spaaractie_id: element
                },
                include: { all: true}
            })
            .then((user) => {                
                CustomerHasSpaaractie.increment({
                    stamp_amount: Math.floor(order.finalPrice / user.spaaractie.stamp_price)
                },
                { 
                    where: { 
                        customer_has_spaaractie_id: user.customer_has_spaaractie_id
                    } 
                })
                .then((acties) => {
                    console.log(acties)
                })
                .catch((err) =>{        
                    Logger.log(1, err)
                })
            });
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
                    const product = req.body.product;
                    await OrderHasProduct.create({
                      amount: product.amount,
                      discounted_price: product.discounted_price,
                      order_id: product.order_id,
                      picked: product.picked,
                      price: product.price,
                      product_id: product.product_id,
                      reason_return: product.reason_return,
                      returned: product.returned,
                    }, {logging: false});
                  
                    const result = await Order.findByPk(order.uuid_id, {
                      include: [
                        { all: true}, 
                        {model: OrderHasProduct, 
                            as: "product_list", 
                            include: [{
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
                                },
                                Product.Department,
                                {
                                    model: ProductHasDiscount,
                                    as: 'product_has_discount_list',
                                    required: false,
                                    include: [
                                        {
                                            model: Discounts,
                                            as: 'discount_info'
                                        }
                                    ]  
                                }
                            ]},
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
                   await OrderHasProduct.bulkCreate(items, {
                      logging: false,
                      paranoid: false,
                      updateOnDuplicate: ["amount", "price", "picked", "reason_return", "returned", "discounted_price"],
                    });

                    const newProductList = await upProduct.updateProducts(order.uuid_id, order.pickupDate)
                  
                    const updatedOrder = await Order.update(order, {
                      where: { uuid_id: order.uuid_id },
                      include: [{ association: "product_list" }],
                      returning: true
                    });
                  
                    if (order.status === "scanned") {
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
            case 'Onlinepayment':
                var mystr = cryptr.decrypt(req.params.orderId);
                Order.findByPk(mystr, {  
                    logging: false,       
                    include: [{ all: true,}, {model: OrderHasProduct, as: "product_list", include: [{model: Product, as: "product"}]}]
                })
                .then((result) => {
                    if(result.status == 'scanned'){
                        mollieClient.payments.create({
                            amount: {
                                value: parseFloat(result.finalPrice).toFixed(2),
                                currency: 'EUR'
                            },
                            description: 'Online bestelling Coop Lubbers',
                            redirectUrl: process.env.BASE_URL,
                            webhookUrl: process.env.MOLLIE_WEBHOOK,
                            method: 'ideal'
                        })
                        .then(payment => {
                            result.paycode = payment.id
                            result.save()
                            res.status(200).send({
                                "docs": payment,
                                "order": result
                            });
                            Logger.log(2, `${order} || ${req.headers}`)
                        })
                    }
                    else{
                        res.status(200).send(result);
                        Logger.log(1, err)
                    }
                })
                .catch((err) =>{     
                    res.status(200).send({'err' : err});   
                    Logger.log(1, err)
                })
                break;
            case "Storepayment":
                var picker = req.body.picker
                var order = req.params.orderId                
                Order.findByPk(order, {     
                    logging: false,    
                    include: [{ all: true,}, {model: OrderHasProduct, as: "product_list", include: [{model: Product, as: "product"}]}]
                })
                .then((result) => {
                    result.paycode = `employee-${picker}`
                    result.save()
                    Logger.log(2, `${order} || ${req.headers}`)
                    res.status(200).send({'success' : true, 'message': 'Succesvol afgerekend'});   
                })
                .catch((err) =>{     
                    res.status(200).send({'err' : err});   
                    Logger.log(1, err)
                })
            break;

            /*    var product = req.body.product
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
                    })
                })
                break;*/
            default: break;
        }

        
    }
};