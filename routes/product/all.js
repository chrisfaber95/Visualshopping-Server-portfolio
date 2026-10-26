const {Product, Productinformation, Department, Levertijden, Customer, CustomerHasFavorite, ProductHasDiscount, Discounts, ProductAdditionInformation}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    if(req.query?.customer_id){
        var customer_id = req.query.customer_id
        delete req.query.customer_id
        Product.findAll({
            logging: false,  
            where: req.query,
            include: [
                {
                    model: Productinformation,
                    as: 'product_information',
                    required: false,
                    include: [
                        {
                            model: ProductAdditionInformation,
                            as: 'product_additional_information_list'
                        }
                    ]  
                }
                , 
                Product.ProductVariant,
                {model: Department, required: false, as: 'department' },
                Product.Levertijden,
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
                },
                {
                    model: CustomerHasFavorite,
                    as: 'favorite_products_list',
                    where:{
                        customer_id: {[Op.eq]: customer_id}
                    },
                    required: false
                }],
            exclude: [Product.OrderHasProduct, Product.ShoppingListHasProduct] 
        })
        .then((product) => {
            res.status(200).json( product );
        })
        .catch((err) =>{        
            Logger.log(1, err)
        })
    }
    else{
        Product.findAll({    
            logging: false,       
            where: req.query,
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
                Product.ProductVariant, 
                Product.Department, 
                Product.Levertijden,
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
            exclude: [Product.OrderHasProduct] 
        })
        .then((product) => {
            res.status(200).json( product );
        })
        .catch((err) =>{        
            Logger.log(1, err)
        })
    }
};
