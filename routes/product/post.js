const {Product, Productinformation, ProductAdditionInformation}= require('../../models/index');
const { Op, Sequelize } = require("sequelize");
const Logger = require('../../config/logging.js');

module.exports = async (req, res) => {
	try {
        var products = req.body
		var exists = await Product.findOne({
		logging: false,
		where: {
			ean: products.ean
		},
		paranoid: false,
		include: [
			{
				model: Productinformation,
				as: 'product_information',
				required: false,
				include: [
					{
						model: ProductAdditionInformation,
						as: 'product_additional_information_list',
						required: false,
					}
				]
			},
			Product.ProductHasDiscount,
			Product.Levertijden,
			Product.Department,
			Product.ProductVariant,
		],
		exclude: [
			Product.OrderHasProduct,
			Product.ShoppingListHasProduct,
			Product.CustomerHasFavorite
		]
	})

	if(!exists){
	var prod = await Product.create(products, {
		logging: false,
		paranoid: false,
		fields: [
			"price",
			"nix18",
			"syndyid",
			"ean"
		],
		include: [
			{
				model: Productinformation,
				as: 'product_information',
				required: false,
				include: [
					{
						model: ProductAdditionInformation,
						as: 'product_additional_information_list',
						required: false
					}
				]
			},
			Product.ProductHasDiscount,
			Product.Levertijden,
			Product.Department,
			Product.ProductVariant,
		],
		updateFields: [
			"price",
			"nix18",
			"syndyid",
			"product_information.title",
			"product_information.variant",
			"product_information.ingredients",
			"product_information.product_additional_information_list.name",
			"product_information.product_additional_information_list.value"
		],
		exclude: [
			Product.OrderHasProduct,
			Product.ShoppingListHasProduct,
			Product.CustomerHasFavorite,
		]
	});
}
else{
	exists.price = products.price
	exists.previous_price = exists.price
	exists.nix18 = products.nix18
	exists.department_id = products.department_id
	exists.product_information.title = products.product_information.title
	exists.product_information.variant = products.product_information.variant
	exists.product_information.ingredients = products.product_information.ingredients
}
const prod_item = exists || prod
	const product_information = products.product_information;
	if(prod_item.product_information.product_additional_information_list.length == 0){
        if (product_information?.product_additional_information) {
            const additionalInformationList = product_information.product_additional_information;
            for (const info of additionalInformationList) {
				const add = await ProductAdditionInformation.create({
					name: info.name,
					type: info.type,
					value: info.value,
					product_information_id: prod_item.product_information.id
				}, { isNewRecord: true });
            }
        }
	}

	Logger.log(2, prod_item.id)
	res.status(200).json(updated);

    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: error });
    }
};
