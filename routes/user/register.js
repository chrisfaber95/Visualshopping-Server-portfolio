const db = require('../../config/connection');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

module.exports = (req, res) => {
	const  email  =  req.body.email;
	const  hash  =   req.body.pass;
	const name = req.body.name;

	var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
	
	const  hashing  =   retVal;
	//if(req.body.pass == null){
	//	hash = "password"
	//}

    var password = "";
    bcrypt.hash(hashing, salt, function(err, hash) {
    // Store hash in your password DB.
        password = hash;
        createUser([email, password, hashing, name], (err, result)=>{
			if(err) return  res.status(500).send("Server error!");
			else if(result.registered != null){res.status(200).json({err: 'Gebruiker al geregistreerd'})}
			else{
				const expiresIn = 24 * 60 * 60 * 1000;
				const accessToken = jwt.sign({id: result.id}, SECRET_KEY, {
					expiresIn: expiresIn
				});
				const user = {
					"email":  result[0].email, 
					"access_token":  accessToken, 
					"expires_in":  expiresIn, 
					"id_token": result[0].id 
				}
				res.status(200).json({user})

			}
        });
    })
}

const  createUser  = (user, cb) => {
	var sqlquery = "CALL register_user('"+user[0]+"', '"+user[1]+"', '"+user[3]+"')";
	db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		return result;
	}) 	
}