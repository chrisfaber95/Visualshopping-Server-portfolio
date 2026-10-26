
const {ActieOrder, ActieOrderHasProduct, Product, Productinformation, ProductAdditionInformation, actieOrderProductHasVariant, ProductVariant, OrderInformation, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

module.exports = (req, res) => {
    var mystr;
    if (req.params.orderId.length > 40) {
        mystr = cryptr.decrypt(req.params.orderId);
    } else {
        mystr = req.params.orderId
    }

    ActieOrder.findByPk(mystr, {      
        logging: false,   
        where: req.query,
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
                as: "actie_order_information", 
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