const {Discounts,ProductHasDiscount, Product, Department, Levertijden, Customer, CustomerHasFavorite }= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var customer_id = req.query.customer_id
    delete req.query.customer_id
    var query = req.query
    var where = {}
        var customer_id = req.query.customer_id
        delete req.query.customer_id
    if(Object.keys(query).length > 0){
        if(query.date){
            let date = query.date
            var start = {'starting_date' : {
                [Op.lte] : date
            }}
            var end = {'end_date' : {
                [Op.gte] : date
            }}
            Object.assign(where,start);
            Object.assign(where,end);
            delete query.date
        }
        if(Object.keys(query).length > 0){
            Object.assign(where,query);
        }
    }
    console.log(where)
    Discounts.findAll({    
        //logging: false,  
        where: where,
        include: [
            {
                model: ProductHasDiscount,
                as: 'product_discount_list',
                include: [
                    {
                        model: Product,
                        as: 'product_discount',
                        required: true,
                        include: [
                            Product.Productinformation, 
                            Product.ProductVariant,
                            {model: Department, required: false, as: 'department' },
                            Product.Levertijden,
                            {
                                model: CustomerHasFavorite,
                                as: 'favorite_products_list',
                                where:{
                                    customer_id: {[Op.eq]: customer_id}
                                },
                                required: false
                            }],
                        exclude: [Product.OrderHasProduct, Product.ShoppingListHasProduct] ,
                        where: [
                            {
                                stock: 1
                        }
                            
                        ],
                        exclude: [Product.OrderHasProduct]
                    }
                ]
            }
        ]
        //exclude:  [Product] 
    })
    .then((discounts) => {
        console.log(discounts)
        res.status(200).json( discounts );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
};