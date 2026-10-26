
const {Order, OrderInformation, Customer, OrderHasProduct, Product, Productinformation, ProductAdditionInformation, ProductHasDiscount, Discounts}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

module.exports = (req, res) => {
    var mystr;
    var where = {}
    if (req.params.orderId.length > 40) {
        mystr = cryptr.decrypt(req.params.orderId);
        where = {
            id: mystr
        }
        console.log(mystr)
    } else {
        mystr = req.params.orderId
        where = {
            uuid_id: mystr
        }
    }
    Order.findOne({   
        //logging: false,      
        where: where,
        paranoid: false,  
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
       
    })
    .then((order) => {
        res.status(200).json( order );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};