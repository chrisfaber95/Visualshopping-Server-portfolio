
const {ShoppingList}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
    try {
		var list = {
			customer_id: req.body.customer_id || null,
			shoppinglist_products: []
		}
		req.body.shoppinglist_products.forEach(element => {
			list.shoppinglist_products.push({
				product_id: element.product_id,
				amount: element.amount
			})
		});
		ShoppingList.create(list, {
			logging: false,   
			include: [
				ShoppingList.ShoppingListHasProduct
			]
		})
		.then((user) => {
			res.status(200).json( user );
		})
		.catch((err) =>{        
			Logger.log(1, err)
			let err_message = "De volgende velden bestaan al: "
			for(field in err.fields){
				err_message += field.toString()
			}
			err_message += err
			res.status(200).json( {err: err_message });
		})
    } catch (error) {        
        Logger.log(1, error)
		res.status(200).json( {err: error });
    }
    
};

/*
const db = require('../../config/connection');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
	const  email  =  req.body.email;
    const  hashing  =   req.body.password;

    var password = "";
    bcrypt.hash(hashing, salt, function(err, hash) {
    // Store hash in your password DB.
        password = hash;
		var data = req.body
		var info = {
			'data': data,
			'pass': password
		}
        createUser(info, (err, result)=>{
			if(err){ 			
				Logger.log(1, err)			
				return  res.status(500).send("Server error!")				
			}
			else if(result.registered != null){				
				Logger.log(1, result)	
				res.status(200).json({err: 'Gebruiker al geregistreerd'})				
			}
			else{
				const user = {
					"email":  result[0].email,
					"status": "registered"
				}
				Logger.log(2, user)
				res.status(200).json({user})		
			}
        })
    })
}

const  createUser  = (info, cb) => {
    const  hash  =   info.pass;
    var pass = "";
	pass = hash;	
    var sqlquery = "CALL register_user('"+info.data.email+"','"+ pass +"','"+info.data.firstName+" "+info.data.lastName+"','"+info.data.role_id+"','"+info.data.username+"'); ";
	db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		return result;
	}) 	
}*/
