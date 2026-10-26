const {Order, OrderHasProduct, Product, Productinformation, Customer, OrderInformation}= require('../../models/index');
const { Op, Sequelize } = require("sequelize");
const Logger = require('../../config/logging.js');
require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

async function getInvoiceNumber() {
	// Generate a default invoice number using the current date/time and order number
	const now = new Date();
	console.log(this)
	const id = this.id;
	const ordersToday = await Order.count({ where: { createdAt: { [Sequelize.Op.gte]: startOfDay(now) } }});
	const orderNumber = ordersToday + 1;
	let number = generateInvoiceNumber('3555', this.orderType, now, orderNumber).toString();
	console.log(number)
	return number;
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
  // Helper function to generate an invoice number based on the provided parameters
  function generateInvoiceNumber(storeNumber, orderType, date, orderNumber) {
    const prefix = orderType === 1 ? 'A' : 'B';
    const timestamp = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
    console.log(`NL${storeNumber}_${timestamp}_${padNumber(orderNumber)}`)
    return `NL${storeNumber}_${timestamp}_${padNumber(orderNumber)}`.toString();
  }

  function padNumber(number) {
    // Pad a number with a leading zero if it's less than 10
    if (number < 10) {
      return "000" + number;
    } 
    if (number < 100) {
        return "00" + number;
    }
    if (number < 1000) {
        return "0" + number;
    }  else {
      return number;
    }
  }

module.exports = (req, res) => {
	var userDetails = req.body.userDetails
	var invoiceDetails = req.body.invoiceDetails
	var orderDetails = req.body.orderDetails
	var orderProducts = req.body.orderProducts
	try{
		var api = ''
        if(userDetails.klantenkaart == '6207038699858' || userDetails.klantenkaart == '1000000000001') {
            api = process.env.MOLLIE_TEST_API}
        else{  api = process.env.MOLLIE_API}
const mollieClient = createMollieClient({ apiKey: api });
		mollieClient.payments.create({
			amount: {
				value:    parseFloat(orderDetails.picking_price).toFixed(2),
				currency: 'EUR'
			},
			description: 'Uw bestelling bij Coop Lubbers',
			redirectUrl: `${req.get('origin')}?return=payment`,
			webhookUrl:  process.env.MOLLIE_WEBHOOK,
			method: req.body.selectedBetaal
		})
		.then(async (payment) => {
			let invoice_number = await getInvoiceNumber();
			Order.create({
				delivery: orderDetails.delivery,
				pickupDate: orderDetails.pickupDate,
				pickupTime: orderDetails.pickupTime,
				totalPrice: orderDetails.totalPrice,
				koopzegels: orderDetails.koopzegels,
				spaarzegels: orderDetails.spaarzegels.toString(),
				picking_price: orderDetails.picking_price,
				paymentMethod: payment.id,
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
					street: userDetails.address.street,
					house_number: userDetails.address.house_number,
					house_addition: userDetails.address.house_addition,
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
					street: invoiceDetails.address.street,
					house_number: invoiceDetails.address.house_number,
					house_addition: invoiceDetails.address.house_addition,
					zipcode: invoiceDetails.zipcode,
					city: invoiceDetails.city,
					country: invoiceDetails.country,
					customer_id: invoiceDetails.customer_id
				},
				storepoints: orderDetails.storepoints,
				invoice_number: invoice_number
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
                Logger.log(1, JSON.stringify(order) + "||" + JSON.stringify(payment))
				var products = []
				for (const [key, value] of Object.entries(orderProducts)) {
					products.push({
						amount: value.amount,
						order_id: order.id,
						product_id: value.product.id,
						price: value.product.price					
					})
				}
				OrderHasProduct.bulkCreate(products,{					
					logging: false
				})
				.then((orderprods) => {
					res.status(200).send({ 
						"payment":  payment._links.checkout.href,
						"success": true
					});
				})
			})
			.catch((error) => { 
				res.status(400).send({ 
					"docs":  error,
					"success": false 
				});
                Logger.log(1, error)
			})
		})
	}
	catch(error){
		res.status(400).send({ 
			"docs":  error,
			"success": false 
		});
	}	
};

	
