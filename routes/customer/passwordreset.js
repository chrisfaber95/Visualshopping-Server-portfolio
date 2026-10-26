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

  const sendOrderMail = async function(mail, resetCode){
	const options = await mailing.setPasswordResetMailOptions(
	mail,
	mailing.accountForgetTemplate(resetCode))	
	try{								
		mailing.transporter.sendMail(options
		, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
                Logger.log(2, JSON.strinfify(info))				
                console.log('Email sent: ' + info.response); 
			  }
		});
	}
	catch(err){
        Logger.log(1, JSON.strinfify(err))
		console.error(err)
	}
}

module.exports = (req, res) => {
    Logger.log(2, JSON.stringify(req.headers) + ' || ' + req.baseUrl + '||' + JSON.stringify(req.body)) 
    try {
        let user = req.body.user
		user.email = user.email.toLowerCase()
		user.email = user.email.replace(/ /g,'')
        const resettoken = req.body.user.resettoken || ''
        user.resettoken = ''
       /* if(resettoken == ''){
            res.status(200).json({
                message: 'Something went wrong.',
                success: false
            });
        }
        else{*/
            if (user.hasOwnProperty('password')){
                bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                Customer.update(user,
                    {
                        logging: false,   
                        where: {
                            email: user.email,
                            resettoken: resettoken           
                        },
                    })
                    .then((user) => {
                        if(user[0] == 1){
                            res.status(200).json({
                                message: 'Wachtwoord gewijzigd, u kunt nu opnieuw inloggen.',
                                success: true
                            });
                        }
                        else{
                            res.status(200).json({
                                message: 'Something went wrong',
                                success: false
                            });
                        }                    
                    })
                    .catch((err) =>{     
                        Logger.log(1, err)
                    })
                })
                //.catch((err) =>{
                //    Logger.log(1, err)
               // })
            }
            else{
                user['resettoken'] = token()
                Customer.update(user,
                {
                    where: {email: user.email},
                })
                .then((userUpdate) => {
                    sendOrderMail(user.email, user.resettoken)
                    if(userUpdate[0] == 1){
                        res.status(200).json({
                            message: 'Je hebt succesvol een nieuw wachtwoord aangevraagd. Binnen twee uur ontvang je een e-mail met verdere instructies.',
                            success: true
                        });
                    }
                    else{
                        res.status(200).json({
                            message: 'Iets ging verkeerd, controleer uw ingevulde emailadres.',
                            success: false
                        });
                    } 
                })
                .catch((err) =>{  
                    Logger.log(1, err)
                })
            }
        }
    catch (error) {
        res.status(200).json({
            message: 'Something went wrong',
            success: false
        });  
        Logger.log(1, error)
    }
    
};
