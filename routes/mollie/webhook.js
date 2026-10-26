const {Order, OrderHasProduct, Product, CustomerHasSpaaractie, Productinformation, OrderInformation, Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const mailing = require('../../config/mailing.js')
const nodemailer = require("nodemailer");
//const QRCode = require("qrcode");
const bwipjs = require('bwip-js');

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });
const mollieClientTest = createMollieClient({ apiKey: process.env.MOLLIE_TEST_API });

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

/*
	function sendOrderMail(orderInfo, qrcode, stat){
		var id = orderInfo.order_id
		
		console.log(id)
		var mystr = cryptr.encrypt(id);
		
		console.log(mystr)
		const cooplogo = "https://www.coop.nl/INTERSHOP/static/WFS/COOP-COOPBase-Site/-/COOP/nl_NL/logo's/COOP_logo_RGB_pay-off.png"
		var html = ''
		if(stat == 'payed'){		
			html = '<div style="width: 80%"><table>\
					<tr style="width: 100%; background-color: orange;">\
					<td style="width:30%;"><img style="width: 100%;" src="'+ cooplogo +'" />\
					</td><td style="width:70%;"><h1 style="color: white">Orderbevestiging</h1></td></tr>\
					<tr style="width: 100%; background-color: white;"><td style="width:30%;"></td><td style="width: 40%;">\
					<img style="border-color: red; width: 99%; background-color: white;" src="cid:qrcode@cooplubbers.nl" />\
					</td><td style="width:30%;"></td></tr>\
					<tr style="width: 100%;"><td style="width:30%;"></td><td style="width: 40%;">\
					<p>Bedrag: '+ orderInfo.totalPrice +'</p></td><td style="width:30%;"></td></tr>\
					</table></div>'
		}
		else if(stat == 'ordered'){
			html = `<div style="width: 80%"><table>
					<p>Uw bestelling is ingepakt, deze bestelling bevat de volgende producten</p>\
					<tr style="width: 100%; background-color: orange;">
					<td style="width:30%;"><img style="width: 100%;" src="'+ cooplogo +'" />
					</td><td style="width:70%;"><h1 style="color: white">Order betaling</h1></td></tr>
					<tr style="width: 100%; background-color: white;"><td style="width:30%;"></td><td style="width: 40%;">
					<img style="border-color: red; width: 99%; background-color: white;" src="cid:qrcode@cooplubbers.nl" />
					</td><td style="width:30%;"></td></tr>
					<tr style="width: 100%;"><td style="width:30%;"></td><td style="width: 40%;">
					<p>Bedrag: ${orderInfo.totalPrice}</p></td><td style="width:30%;"></td></tr>
					</table>
					<p>Via de onderstaande link kunt u uw bestelling betalen en vervolgens ophalen vanaf uw gekozen tijd</p>
					<a href="testwinkel.tk/paypage/${mystr}">testwinkel.tk/paypage/${mystr}</a></div>`
		}
	  // Generate test SMTP service account from ethereal.email
	  // Only needed if you don't have a real mail account for testing
	 // let testAccount = await nodemailer.createTestAccount();

	  // create reusable transporter object using the default SMTP transport
	  let transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS
		  }
		});
	
	/*let transporter = nodemailer.createTransport({
		  host: "smtp.hostnet.nl",
		  port: 587,
		  secure: false, // upgrade later with STARTTLS
		  auth: {
			user: "Bestellingen@cooplubbers.nl",
			pass: "password"
		  }
		});
		
	  
	
		transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
			  }
		});
	}	*/					
							//


module.exports = (req, res) => {
    mollieClient.payments
    .get(req.body.id)
    .then(payment => {
		if (payment.isPaid()) {
			
			let where = {}
			where[Op.or] = []
            where[Op.or].push({"paymentMethod": payment.id})
            where[Op.or].push({"paycode": payment.id})
			Order.findOne({
				where: where,
				include: [
					{ all: true} ,
					{model: OrderHasProduct, 
						as: "product_list", 
						include: [{
							model: Product, 
							as: "product", 
							include: [{
								model: Productinformation,
								as: 'product_information',
							   attributes: ['title', 'ean']
							}]
						}]
					},
					{model: OrderInformation, 
						as: "order_information", 
						include: [{
							model: Customer, 
							as: "customer"
						}]
					}
				]
				
			})
			.then((order) => {
				switch (order.status) {			
					case 'pending':									
						order.update({status: 'ordered'})	
						Logger.log(2, JSON.stringify(order))
						sendOrderMail(order)
						break;
					case 'scanned':				
					Logger.log(2, JSON.stringify(order))
						order.update({status: 'payed'})
						break;
					default:
						break;
				}
				order.save()
			})
			/*
			var sqlquery = "call changeOrderStatus('"
				sqlquery += payment.id + "'); "			
			db.connection.query(sqlquery, function (err, result){
				console.log(result)
				if(err) throw err;
				else{
					if(result != null){
						console.log(result)
						if(result[0][0].status == 'ordered'){
							Logger.log(2, "Order Query" + "|" + req.originalUrl + "|" + JSON.stringify(req.headers))
							sendOrderMail(result[0][0])							
						}
						const docs = "product updated";
					}
				}
			})*/
        // Hooray, you've received a payment! You can start shipping to the consumer.
		  //  ordersdb.update({ payment: req.body.id }, { $set: { status: 'Paid' } }, { multi: false }, function (err, numReplaced) {
           // console.log(payment);

         //   sqlquery = "INSERT INTO `Information` (`page`, `subonderdeel_id`, `text`) VALUES ("+req.body.iPage + ", "+req.body.sId+ ", '"+req.body.iText+"');"
   




	//	})
      } else if (!payment.isOpen()) {
        // The payment isn't paid and has expired. We can assume it was aborted.
		Logger.log(1, JSON.stringify(payment))
		console.log("is not paid")
      }
      res.send(payment.status);
    })
    .catch(error => {
		Logger.log(1, error)
		mollieClientTest.payments
		.get(req.body.id)
		.then(payment => {
			if (payment.isPaid()) {
				
				let where = {}
				where[Op.or] = []
				where[Op.or].push({"paymentMethod": payment.id})
				where[Op.or].push({"paycode": payment.id})
				Order.findOne({
					logging: false,
					where: where,
					include: [
						{ all: true} ,
						{model: OrderHasProduct, 
							as: "product_list", 
							include: [{
								model: Product, 
								as: "product", 
								include: [{
									model: Productinformation,
									as: 'product_information',
								   attributes: ['title', 'ean']
								}]
							}]
						},
						{model: OrderInformation, 
							as: "order_information", 
							include: [{
								model: Customer, 
								as: "customer"
							}]
						}
					]
					
				})
				.then((order) => {
					switch (order.status) {			
						case 'pending':									
							order.update({status: 'ordered'})	
							sendOrderMail(order)
							break;
						case 'scanned':				
							order.update({status: 'payed'})
							break;
						default:
							break;
					}
					order.save()
				})
		} else if (!payment.isOpen()) {
			// The payment isn't paid and has expired. We can assume it was aborted.
			console.log("is not paid")
		  }
		  res.send(payment.status);
		})
		.catch(error => {
		  // Do some proper error handling.
			Logger.log(1, error)
		  res.send(error);
	})    
});
  
 //   db.connection.query(sqlquery, function (err, result3){
//		if(err) throw err;
//		const info = result3;
 //       res.status(200).json({info});
//	})   
};


const sendOrderMail = async function(info1){
    var customerEmail = ''
    if(info1.order_information.customerEmail == '' || info1.order_information.customerEmail == null){
        customerEmail = info1.order_information.customer.customerEmail
    }
    else{
        customerEmail = info1.order_information.customerEmail
    }
	const options = await mailing.setOrderMailOptions(
	customerEmail,
	mailing.orderedTemplate(info1))	
	try{								
		mailing.transporter.sendMail(options
		, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response); 
			  }
		});
	}
	catch(err){
		console.error(err)
	}
}