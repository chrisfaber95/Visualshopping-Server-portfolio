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
    let where = {}
    where[Op.and] = []
    where[Op.and].push({"email": process.env.REMINDER_TEST_MAIL})
    Customer.findAll({
        where: where,
        include: [
            {model: CustomerHasSpaaractie, 
                as: "spaaractie_list",
				where: {"spaaractie_id": 'a6df99a0-301e-11ed-b67e-0242ac110003'}
            }
        ],
        attributes: ['email', 'storepoints']
        
    })
    .then((customer) => {
		customer.forEach(element => {
			sendActieReminderMail(element)
		});
        res.status(200).send({ 
            "message":  `Klanten: ${customer.length}`,
            "success": true
        });
    })
    .catch((error) => { 
        console.log(error)
        Logger.log(1, error)
    })
	
	const sendActieReminderMail = async function(info1){
		const options = await mailing.setActieReminderOptions(
        info1.email,
		mailing.actieReminderTemplate(info1))	
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

	
