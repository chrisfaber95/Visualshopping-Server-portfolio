const {Order, OrderHasProduct, Product, Productinformation, Customer, OrderInformation, Department,Discounts, ProductHasDiscount, ProductAdditionInformation}= require('../../models/index');
const { Op, json } = require("sequelize");
const Logger = require('../../config/logging.js');
const moment = require("moment")


function deepIterator (target) {
    if(typeof(target) === 'string'){
        target = JSON.parse(target)
    }
    if (typeof target === 'object') {
      for (const key in target) {
        deepIterator(target[key]);
      }
    } else {
    }
  }

module.exports = (req, res) => {
    var parameters = req.query
    var where = {[Op.and]: []}
    try {
        for(const key in parameters){
            var param = JSON.parse(parameters[key][0])
            for(const val in param.value){
                for(const key in param.value[val]){
                    if (key == 'pickupDate') {param.value[val][key] = moment(new Date(param.value[val][key])).toISOString()}
                    if(param.value[val][key].hasOwnProperty('filterType')){
                        param.value[val][key] = {[Op[param.value[val][key].filterType]]: param.value[val][key].value}
                        
                    }
                }
            }
            where[Op.and].push({[Op[param.filterType]]: param.value})
        }
    } catch (error) {
        Logger.log(1, error)
    }
    Order.findAll({   
        logging: false,
        paranoid: false,   
        where: where,
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
        order.forEach(element => {
            element.pickupDate = new Date(element.pickupDate).toISOString().split('T')[0]
            element.save()
        });
        res.status(200).json( order );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};