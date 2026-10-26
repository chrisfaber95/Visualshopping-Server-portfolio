const {Customer}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const mailing = require('../../config/mailing.js')
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

const rand = () => {
    return Math.random().toString(36).substr(2);
  };
  
  const token = () => {
    return rand() + rand();
  };

  const sendOrderMail = async function(mail, email, resetCode){
	const options = await mailing.setFeedbackMailOptions(
	mail,
    email,
	mailing.feedbackTemplate(resetCode))	
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

module.exports = (req, res) => {
    var info = req.body.details
    Logger.log(2, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body)) 
    try {
        var info = req.body.details
        sendOrderMail(process.env.FEEDBACK_MAIL, info.email, JSON.stringify(info))
        res.status(200).json({
            message: 'Bedankt voor uw feedback.',
            success: true
        });
    }
    catch (error) {
        res.status(200).json({
            message: 'Something went wrong',
            success: false
        });  
        Logger.log(1, error)
    }
    
};
