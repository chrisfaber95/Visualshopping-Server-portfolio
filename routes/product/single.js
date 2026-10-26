const {Product, NutrientRecords, Nutrients, ProductHasDiscount, Discounts}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = (req, res) => {
    var ean = req.params.productId
    let where = {}
    where[Op.or] = []
    where[Op.or].push({"ean": ean})
    Product.findOne({
        logging: false,
        where: where,
        include: [
            Product.Productinformation, 
            {
                model: Nutrients,
                as: 'nutrients',
                include:[{
                    model: NutrientRecords,
                    as: 'nutrient_records',
                    include:[
                        NutrientRecords.PrecisionTypes,
                        NutrientRecords.RecordsUoMs,
                        NutrientRecords.NutrientTypes
                    ]
                },
                  Nutrients.PortionUoMs  
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
            }],
        exclude: [Product.OrderHasProduct] 
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{     
        res.status(200).json( {'err':err });   
        Logger.log(1, err)
    })
};
