const db = require('../../config/connection');
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

	
	
	function sendOrderMail(orderInfo, qrcode){
			qrcode = qrcode.replace('data:image/png;base64,', '')
			const cooplogo = "https://www.coop.nl/INTERSHOP/static/WFS/COOP-COOPBase-Site/-/COOP/nl_NL/logo's/COOP_logo_RGB_pay-off.png"
			var html = '<div style="width: 80%"><table>'
				html += '<tr style="width: 100%; background-color: orange;"><td style="width:30%;"><img style="width: 100%;" src="'+ cooplogo +'" /></td><td style="width:70%;"><h1 style="color: white">Orderbevestiging</h1></td></tr>'
				html += '<tr style="width: 100%;"><td style="width:30%;"></td><td style="width: 40%;"><img style="border-color: red; width: 99%; background-color: red;" src="cid:qrcode@cooplubbers.nl" /></td><td style="width:30%;"></td></tr>'
				html += '<tr style="width: 100%;"><td style="width:30%;"></td><td style="width: 40%;"><p>Bedrag: '+ orderInfo.price +'</p></td><td style="width:30%;"></td></tr>'
				html += '</table></div>'
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
			});*/
			
		  let mailOptions = {
			from: '"Coop Lubber Bestellingen" bestellingen@cooplubbers.nl', // sender address
			to: orderInfo.email, // list of receivers
			subject: "Bestelling bij Coop", // Subject line
			text: "Uw bestelling bij Coop Lubbers", // plain text body
			html: html,  // html body
			 attachments: [
            // Binary Buffer attachment
				{
					filename: 'image.png',
					content: Buffer.from(
						qrcode,
						'base64'
					),

					cid: 'qrcode@cooplubbers.nl' // should be as unique as possible
				}
			],

		  };
		
			transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
			});
		}	

function parseCartJSON(json){
	let parsed = new Map (JSON.parse(json));
	return parsed
}
module.exports = (req, res) => {
	if(req.body.cart == null ||
		req.body.email == null ||
		req.body.credentials.name == null ||
		req.body.credentials.telefoon == null ||
		req.body.pickupDate == null ||
		req.body.pickupTime.mm == null ||
		req.body.pickupTime.HH == null
	){
		res.status(200).send({ 
			"docs":  error,
			"success": false 
		});
	}
	else{
        if(req.body.selectedBetaal != "contant"){
			try{
				mollieClient.payments.create({
					amount: {
						value:    req.body.orderprice,
						currency: 'EUR'
					},
					description: 'Uw bestelling bij Coop Lubbers',
					redirectUrl: req.get('origin'),
					webhookUrl:  process.env.MOLLIE_WEBHOOK,
					method: req.body.selectedBetaal
				})
				.then(payment => {
					console.log(req.body)
					let kzegels = req.body.credentials.koopzegels
					let spaarzegels = req.body.credentials.spaarzegels
					let klantenkaart = req.body.credentials.pasnummer
					var sqlquery = "call addOrder( "
						sqlquery += req.body.price + ", "
						sqlquery += db.connection.escape(req.body.cart) + ", "
						sqlquery += db.connection.escape(req.body.email) + ", '"
						sqlquery += req.body.selectedBetaal + "-"+ payment.id +"', "
						sqlquery += db.connection.escape(req.body.credentials.name) + ", "
						sqlquery += db.connection.escape(req.body.credentials.telefoon) + ", '"
						sqlquery += req.body.pickupDate + "', '"
						sqlquery += req.body.pickupTime.HH +":" + req.body.pickupTime.mm +"', '"
						sqlquery += kzegels + "', '"
						sqlquery += spaarzegels + "', "
						sqlquery += db.connection.escape(klantenkaart) + ", "
						sqlquery += req.body.user_id +', '
						sqlquery += '@LID);'
						sqlquery += "select @LID as order_id;"
						
				   db.connection.query(sqlquery, function (err, result){
						if(err) throw err;
						var cart = JSON.parse(req.body.cart)
						var sqlquery1 = ""
						insertId = result[1][0].order_id
						for (var item in cart) {
							sqlquery1 += "call addOrderProduct "
							sqlquery1 += "(" + insertId + ", " + cart[item].product_id + ", '" + parseInt(cart[item].amount) + "', " + cart[item].price + "); "
							
						}
						db.connection.query(sqlquery1, function (err, result){
							if(err) throw err;
							const newOrder = result;
							res.status(200).send({ 
								"docs":  payment,
								"order": newOrder,
								"success": true
							});
						})
					})                   
				})
				.catch(error => {
					res.status(200).send({ 
						"docs":  error,
						"success": false 
					});
				});	
			}
			catch(error){
				res.status(200).send({ 
					"docs":  error,
					"success": false 
				});
			}
        }
		else{
            mollieClient.payments.create({
                amount: {
                    value: req.body.orderprice,
                    currency: 'EUR'
                },
                description: 'My first API payment',
                redirectUrl: process.env.BASE_URL,
                webhookUrl:  process.env.MOLLIE_WEBHOOK
            })
            .then(payment => {
              //  console.log(payment);
                var sqlquery = "INSERT INTO `cooplubbers`.`Order` (`totalPrice`, `cart`, `customerEmail`, `paymentMethod`, `customerName`, `CustomerPhone`, `pickupDate`, `pickupTime`, `user_id`)"
                    sqlquery += "VALUES ( "
                    sqlquery += req.body.price + ", "
                    sqlquery += db.connection.escape(req.body.cart) + ", "
                    sqlquery += db.connection.escape(req.body.email) + ", '"
                    sqlquery += req.body.selectedBetaal + "-"+ payment.id +"', "
                    sqlquery += db.connection.escape(req.body.credentials.name) + "', "
                    sqlquery += db.connection.escape(req.body.credentials.telefoon) + ", '"
                    sqlquery += req.body.pickupDate + "', '"
                    sqlquery += req.body.pickupTime.HH +":" + req.body.pickupTime.mm +"', "
                    sqlquery += req.body.user_id
                    sqlquery += ");"

                db.connection.query(sqlquery, function (err, result){
                    if(err) throw err;
                //    console.log(result);
                    const newOrder = result;
					
					QRCode.toDataURL(result.insertedId + '--' + payment.id)
					.then(url => {
						console.log(url)			
					})
					.catch(err => {
						console.error(err)
					})
					
					
					
                    res.status(200).send({ 
                        "docs":  payment,
                        "order": newOrder
                    });
                })                   
            })
            .catch(error => {
                res.status(200).send({ 
                    "docs":  error      
                });
            });	
        }
	}
};

	
