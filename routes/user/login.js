const db = require('../../config/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const SECRET_KEY = "secretkey23456";

const Logger = require('../../config/logging.js')

module.exports = (req, res) => {
    const email = req.body.email || null;
    const hash = req.body.pass || null;
    const tag = req.body.tag || null;
    const serial = req.body.serial || null;
    if (hash != null && email != null) {
		var sqlquery = `
			SELECT user_id, email, password, cardnumber, role_id FROM User
			WHERE email = LOWER(${db.connection.escape(email.toLowerCase())}) or cardnumber = LOWER(${db.connection.escape(email.toLowerCase())})
			LIMIT 1;
			`
        db.connection.query(sqlquery, (err, result) => {
            if (err) {
				Logger.log(1, err)
                res.status(200).send({
                    err
                })
            } else if (result.length > 0) {
                bcrypt.compare(hash, result[0].password, (err, result1) => {
                    if (result1 === true) {
                        const expiresIn = 24 * 60 * 60 * 1000;
                        const accessToken = jwt.sign({ id: result1.id }, SECRET_KEY, {
                            expiresIn: expiresIn
                        });
                        const user = {
                            "email": result[0].email,
                            "access_token": accessToken,
                            "expires_in": expiresIn,
                            "id_token": result[0].user_id,
                            "permissions": result[0].role_id,
                            "cardnumber": result[0].cardnumber
                        }
                        res.status(200).json({ user })
                    } else {
                        var err = "Gebruiker niet gevonden";
						Logger.log(1, JSON.stringify({err, result1}))
                        res.status(200).send({
                            err
                        })
                    }
                })
            } else {
                var err = "Gebruiker niet gevonden";
				Logger.log(1, JSON.stringify({err, result}))
                res.status(200).send({
                    err
                })
            }
        })
    } else if (tag != null && serial != null) {
        var sqlquery = "SELECT `user_id`, `email`, `cardnumber`, `role_id`, `nfc_token`, `nfc_serial` FROM `User` "
        sqlquery += "WHERE `nfc_token` = '" + tag + "' "
        sqlquery += "AND `nfc_serial` = '" + serial + "' "
        sqlquery += " Limit 1;";

        db.connection.query(sqlquery, function(err, result) {
            if (err) {
                res.status(200).send({
                    err
                })
            } else {
                console.log(result)
                var uid = result[0].user_id
                const expiresIn = 24 * 60 * 60 * 1000;
                const accessToken = jwt.sign({ id: uid }, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                console.log(result)
                const user = {
                    "email": result[0].email,
                    "access_token": accessToken,
                    "expires_in": expiresIn,
                    "id_token": result[0].user_id,
                    "permissions": result[0].role_id,
                    "cardnumber": result[0].cardnumber
                }
                res.status(200).json({ user })
            }
        })
    } else {
        var err = "Gebruiker niet gevonden";
        res.status(200).send({
            err
        })
    }
};