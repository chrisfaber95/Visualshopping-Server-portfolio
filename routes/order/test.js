const {Order, OrderHasProduct, Product, CustomerHasSpaaractie, Department, Discounts, ProductHasDiscount}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const mailing = require('../../config/mailing.js')
const calcs = require('../../config/priceCalculations')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);


const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });



module.exports = async (req, res) => {
    if (req.params.orderId) {
      const result = await Order.findByPk(req.params.orderId, {
        include: [
            { all: true }, 
            { model: OrderHasProduct, 
                as: 'product_list', 
                include: [{ 
                    model: Product, 
                    as: 'product',
                    include: [
                        Product.ProductVariant,
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
                    exclude: [Product.OrderHasProduct, Product.ShoppingListHasProduct, Product.CustomerHasFavorite] 
                }]
            }]
      });

      const discounts = await Discounts.findAll({
        include: [{
          model: ProductHasDiscount,
          as: 'product_discount_list',
          include: [{
            model: Product,
            as: 'product_discount',
            required: true,
            include: [
              Product.ProductVariant
            ],
            where: { stock: 1 },
            exclude: [Product.OrderHasProduct, Product.ShoppingListHasProduct]
          }]
        }]
      });
      result.product_list.forEach(element => {
        calcs.updateProductPrice(element)
        //console.log(calcs.calculateProductPrice(element))
      });
      const currentDate = new Date().toISOString().slice(0, 10);
      result.set('product_list', await calcs.calculateDiscountPrices(result.product_list, discounts, currentDate))
     try {
        const products = result.product_list.map((product) => {
            return {
              id: product.id,
              product_id: product.product_id_id,
              amount: product.amount,
              price: product.price,
              picked: product.picked,
              returned: product.returned,
              reason_return: product.reason_return,
              discounted_price: product.discounted_price,
              discount_override: product.discount_override,
              normal_total_price: product.normal_total_price,
              order_id: result.id,
            };
          });
        const res = await OrderHasProduct.bulkCreate(products, 
            { 
                logging: console.log,
                updateOnDuplicate: [
                'amount',
                'price',
                'picked',
                'returned',
                'reason_return',
                'discounted_price',
                'discount_override',
                'normal_total_price'
            
        ] });
      } catch (error) {
        console.error(error)
      }
      result.save((error, savedDoc) => {
        console.log("Inside save callback");
        if (error) {
          console.error('Error while saving document:', error);
        } else {
          console.log('Document saved successfully:', savedDoc);
        }
      });
      res.status(200).send(JSON.stringify(result.product_list));
    }
  };