const {ActieOrder, ActieOrderHasProduct, Product, Productinformation, Customer, OrderInformation, actieOrderProductHasVariant, ProductVariant, CustomerHasSpaaractie}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');

const nodemailer = require("nodemailer");
const mailing = require('../../config/mailing.js')
const QRCode = require("qrcode");

require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

	const updateStamps = (user, order, products) => {
		var cost = 0
		for (const [key, value] of Object.entries(products)) {
			cost += value.actieproduct.stamps_cost * value.amount
		}
		CustomerHasSpaaractie.increment({
			stamp_amount: -cost
		},
		{ 
			where: { 
				customer_id: user.customer_id,
				spaaractie_id: order.spaaractie_id
			} 
		})
		.then((response)=>{
			console.log(response)
		})
	}

	const enoughStamps = (user, order, products) => {
		var cost = 0;
		for (const [key, value] of Object.entries(products)) {
			cost += value.actieproduct.stamps_cost * value.amount;
		}
		CustomerHasSpaaractie.findOne({
			logging: false,   
			where: {
			customer_id: user.customer_id,
			spaaractie_id: order.spaaractie_id
			}
		})
		.then((customerHasSpaaractie) => {
			console.log(customerHasSpaaractie)
			if (customerHasSpaaractie.stamp_amount - cost < 0) {
				return false
			}
			else{
				return true
			}
		})
	}
module.exports = (req, res) => {
	var userDetails = req.body.userDetails
	var orderDetails = req.body.orderDetails
	var invoiceDetails = req.body.invoiceDetails
	var orderProducts = req.body.orderProducts
	var cost = 0;
		for (const [key, value] of Object.entries(orderProducts)) {
			cost += value.actieproduct.stamps_cost * value.amount;
		}
		CustomerHasSpaaractie.findOne({
			logging: false,   
			where: {
			customer_id: userDetails.customer_id,
			spaaractie_id: orderDetails.spaaractie_id
			}
		})
		.then((customerHasSpaaractie) => {
			console.log(customerHasSpaaractie)
			if (customerHasSpaaractie.stamp_amount - cost >= 0) {
		if(orderDetails.delivery == false){
			ActieOrder.create({
				spaaractie_id: orderDetails.spaaractie_id,
				delivery: orderDetails.delivery,
				pickup_date: orderDetails.pickupDate,
				pickup_time: orderDetails.pickupTime,
				delivery_cost: orderDetails.delivery_cost,
				paycode: `afhaal-${userDetails.customer_id}-${Date.now()}`,
				status: "ordered",
				actie_order_information: {
					customerName: userDetails.customerName,
					first_name: userDetails.first_name,
					surname: userDetails.surname,
					kvk: userDetails.kvk,
					business: userDetails.business,
					customerPhone: userDetails.customerPhone,
					klantenkaart: userDetails.klantenkaart,
					customerEmail: userDetails.customerEmail,
					street: userDetails.street,
					house_number: userDetails.house_number,
					house_addition: userDetails.house_addition,
					zipcode: userDetails.zipcode,
					city: userDetails.city,
					country: userDetails.country,
					customer_id: userDetails.customer_id
				},
				invoice_actie_order_information: {
					customerName: invoiceDetails.customerName,
					first_name: invoiceDetails.first_name,
					surname: invoiceDetails.surname,
					kvk: invoiceDetails.kvk,
					business: invoiceDetails.business,
					customerPhone: invoiceDetails.customerPhone,
					klantenkaart: invoiceDetails.klantenkaart,
					customerEmail: invoiceDetails.customerEmail,
					street: invoiceDetails.street,
					house_number: invoiceDetails.house_number,
					house_addition: invoiceDetails.house_addition,
					zipcode: invoiceDetails.zipcode,
					city: invoiceDetails.city,
					country: invoiceDetails.country,
					customer_id: invoiceDetails.customer_id
				}
			},{
				//logging: false,
				include: [{
					model: OrderInformation,
					as: 'actie_order_information'
				}, {
					model: OrderInformation,
					as: 'invoice_actie_order_information'
				},]
			})
			.then((order) => {
				console.log(order)
				console.log(orderProducts)
				var products = []
				for (const [key, value] of Object.entries(orderProducts)) {
					console.log(value)
					if(value.variant){
						for(var variant in value.variant){
							products.push({
								amount: 1,
								actie_order_id: order.actie_order_id,
								product_id: value.product.id,
								price: value.product.price,
								actie_order_product_variant_list: [],
								stamps_cost: value.actieproduct.stamps_cost
							})
							value.variant[variant].forEach((el, ind) => {
								products[products.length - 1]['actie_order_product_variant_list'].push( {product_variant_id: el})
							})
						}
					}
					else{
						products.push({
							amount: value.amount,
							actie_order_id: order.actie_order_id,
							product_id: value.product.id,
							price: value.product.price,	
							stamps_cost: value.actieproduct.stamps_cost
						})
					}
					/*products.push({
						amount: value.amount,
						actie_order_id: order.actie_order_id,
						product_id: value.product.id,
						price: value.product.price					
					})*/
				}
				ActieOrderHasProduct.bulkCreate(
					products,
					{
						include: [{
							model: actieOrderProductHasVariant,
							as: 'actie_order_product_variant_list', 
							include: [{
								model: ProductVariant,
								as: 'product_variant'
							}]
						}]
					}
				)
				.then((orderprods) => {
					
					let where = {}
					where[Op.and] = []
					where[Op.and].push({"actie_order_id": order.actie_order_id})
					ActieOrder.findOne({
						where: where,
						include: [
							{ all: true} , 
							{model: ActieOrderHasProduct, 
								as: "product_list", 
								include: [
									{
										model: Product, 
										as: "product", 
										include: [{
											model: Productinformation,
											as: 'product_information',
										attributes: ['title', 'ean']
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
								include: [{
									model: Customer, 
									as: "customer"
								}]
							}
						]
						
					})
					.then((order) => {
						sendOrderMail(order)
						sendDonarOrderMail(order)
						updateStamps(userDetails, orderDetails, orderProducts)
						res.status(200).send({ 
							"message":  "Bestelling verwerkt",
							"success": true
						});
					})
					.catch((error) => { 
						console.log(error)
						Logger.log(1, error)
					})
				})
			})
			.catch((error) => { 
				console.log(error)
				Logger.log(1, error)
			})
		}
		else{
			try{
				var price = parseFloat(orderDetails.totalPrice || 0) + parseFloat(orderDetails.delivery_cost)
				mollieClient.payments.create({
					amount: {
						value:    parseFloat(price).toFixed(2),
						currency: 'EUR'
					},
					description: 'Uw spaaractie bestelling bij Coop Lubbers',
					redirectUrl: req.get('origin'),
					webhookUrl:  process.env.MOLLIE_ACTIE_WEBHOOK,
					method: req.body.selectedBetaal
				})
				.then(payment => {
					ActieOrder.create({
						spaaractie_id: orderDetails.spaaractie_id,
						delivery: orderDetails.delivery,
						pickup_date: orderDetails.pickupDate,
						pickup_time: orderDetails.pickupTime,
						delivery_cost: orderDetails.delivery_cost,
						paycode: payment.id,
						status: "pending",
						order_information: {
							customerName: userDetails.customerName,
							first_name: userDetails.first_name,
							surname: userDetails.surname,
							kvk: userDetails.kvk,
							business: userDetails.business,
							customerPhone: userDetails.customerPhone,
							klantenkaart: userDetails.klantenkaart,
							customerEmail: userDetails.customerEmail,
							street: userDetails.street,
							house_number: userDetails.house_number,
							house_addition: userDetails.house_addition,
							zipcode: userDetails.zipcode,
							city: userDetails.city,
							country: userDetails.country,
							customer_id: userDetails.customer_id
						},
						invoice_order_information: {
							customerName: invoiceDetails.customerName,
							first_name: invoiceDetails.first_name,
							surname: invoiceDetails.surname,
							kvk: invoiceDetails.kvk,
							business: invoiceDetails.business,
							customerPhone: invoiceDetails.customerPhone,
							klantenkaart: invoiceDetails.klantenkaart,
							customerEmail: invoiceDetails.customerEmail,
							street: invoiceDetails.street,
							house_number: invoiceDetails.house_number,
							house_addition: invoiceDetails.house_addition,
							zipcode: invoiceDetails.zipcode,
							city: invoiceDetails.city,
							country: invoiceDetails.country,
							customer_id: invoiceDetails.customer_id
						}
					},{
						logging: false,
						include: [{
							model: OrderInformation,
							as: 'order_information'
						}, {
							model: OrderInformation,
							as: 'invoice_order_information'
						},]
					})
					.then((order) => {
						var products = []
						for (const [key, value] of Object.entries(orderProducts)) {
							if(value.variant){
								for(var variant in value.variant){
									products.push({
										amount: 1,
										actie_order_id: order.actie_order_id,
										product_id: value.product.id,
										price: value.product.price,
										actie_order_product_variant_list: []
									})
									value.variant[variant].forEach((el, ind) => {
										products[variant]['actie_order_product_variant_list'].push( {product_variant_id: el})
									})
								}
							}
							else{
								products.push({
									amount: value.amount,
									actie_order_id: order.actie_order_id,
									product_id: value.product.id,
									price: value.product.price,	
								})
							}
							/*products.push({
								amount: value.amount,
								actie_order_id: order.actie_order_id,
								product_id: value.product.id,
								price: value.product.price					
							})*/
						}
						ActieOrderHasProduct.bulkCreate(
							products,
							{
								include: [{
									model: actieOrderProductHasVariant,
									as: 'actie_order_product_variant_list', 
									include: [{
										model: ProductVariant,
										as: 'product_variant'
									}]
								}]
							}
						)
						.then((orderprods) => {
							res.status(200).send({ 
								"payment":  payment._links.checkout.href,
								"success": true
							});
						})
					})
					.catch((error) => { 
						Logger.log(1, error)
					})
				})
			}
			catch(error){
				res.status(200).send({ 
					"docs":  error,
					"success": false 
				});
			}
		}
	}
	else{
		res.status(200).send({ 
			"error":  'U heeft te weinig zegels voor deze aankoop. Is dit niet correct, niet correct, neem dan contact op via onze contactpagina.',
			"success": false 
		});
	}})

	const sendOrderMail = async function(info1){
		const options = await mailing.setOrderMailOptions(
		info1.actie_order_information.customerEmail,
		mailing.orderedActieTemplate(info1))	
		try{								
			mailing.transporter.sendMail(options
			, function(error, info){
				  if (error) { 
					console.log(error)
					Logger.log(1, error)
				  } else {
					console.log(info)
					Logger.log(2, 'Email sent: ' + info.response); 
				  }
			});
		}
		catch(err){ 
			console.log(err)
			Logger.log(1, err)
		}
	}

	
	const sendDonarOrderMail = async function(info1){
		const options = await mailing.setOrderMailOptions(
		process.env.DONAR_ORDER_MAIL,
		mailing.orderedDonarTemplate(info1))	
		try{								
			mailing.transporter.sendMail(options
			, function(error, info){
				  if (error) { 
					console.log(error)
					Logger.log(1, error)
				  } else {
					console.log(info)
					Logger.log(2, 'Email sent: ' + info.response + '||' + info1); 
				  }
			});
		}
		catch(err){ 
			console.log(err)
			Logger.log(1, err)
		}
	}

};

	
