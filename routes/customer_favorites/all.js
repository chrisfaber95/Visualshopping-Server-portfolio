const {Product, Department, Levertijden, Customer, CustomerHasFavorite, ProductHasDiscount, Discounts}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {     
    if(req.query?.customer_id){
        var customer_id = req.query.customer_id
        delete req.query.customer_id
        var stock = req.query.stock
        delete req.query.stock
        CustomerHasFavorite.findAll({       
            logging: false,  
            where: req.query,
            include: [
                {
                    model: Product,
                    as: 'favorite_product',
                    include:[
                        Product.Productinformation, 
                        Product.Department, 
                        Product.Levertijden, 
                        {
                            model: CustomerHasFavorite,
                            as: 'favorite_products_list',
                            where:{
                                customer_id: {[Op.eq]: customer_id}
                            },
                            required: true
                        },
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
                    ],
                    exclude: [Product.OrderHasProduct] ,
                    where:{
                        stock: {[Op.eq]: stock}
                    },
                    required: false
                }, 
                {
                    model: Customer,
                    as: 'customer',
                    where:{
                        customer_id: {[Op.eq]: customer_id}
                    },
                    required: true
                }],
        })
        .then((product) => {
            res.status(200).json( product );
        })
        .catch((err) =>{        
            Logger.log(1, err)
        })
    }
    else{
        res.status(200).json( {err: "No user selected"}  );
    }
};