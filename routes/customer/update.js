const {Customer, CustomerSettings, CustomerInformation} = require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const bcrypt = require('bcryptjs'); 
const salt = bcrypt.genSaltSync(10);

module.exports = async (req, res) => {
    try {
        var user = req.body.user;
        var customerId = user.customer_id;
        var pass_change = false
        // Hash the user password, if it exists
        if (user.hasOwnProperty('password') && user.hasOwnProperty('old_password')) {
            const customer = await Customer.findOne({ where: { customer_id: customerId } });
            const oldPasswordIsValid = await bcrypt.compare(user.old_password, customer.password);
            console.log(oldPasswordIsValid)
            if (!oldPasswordIsValid) {
                throw new Error('Oude wachtwoord is niet correct');
            }
            user.password = await bcrypt.hash(user.password, salt);
            pass_change = true
        }

        // Update or create the CustomerSettings record
        const customerSettings = await CustomerSettings.findOne({
            where: { customer_id: customerId },
        });
        if (customerSettings) {
            await customerSettings.update({
                shopheight: user.customer_settings.shopheight,
                shoptype: user.customer_settings.shoptype,
                easy_order: user.customer_settings.easy_order,
                standard_promotions: user.customer_settings.standard_promotions,
                standard_storestamps: user.customer_settings.standard_storestamps,
                quick_scan: user.quick_scan
            });
        } else {
            await CustomerSettings.create({
                customer_id: customerId,
                shopheight: user.customer_settings.shopheight,
                shoptype: user.customer_settings.shoptype,
                easy_order: user.customer_settings.easy_order,
                standard_promotions: user.customer_settings.standard_promotions,
                standard_storestamps: user.customer_settings.standard_storestamps,
                quick_scan: user.quick_scan
            });
        }

        // Update or create the CustomerInformation records
        const customerInformation = user.customer_information;
        await Promise.all(customerInformation.map(async info => {
            const { customer_information_id, ...rest } = info;
            if (customer_information_id) {
                await CustomerInformation.update(rest, {
                    where: { customer_information_id }
                });
            } else {
                await CustomerInformation.create({
                    customer_id: customerId,
                    ...rest
                });
            }
        }));

        // Update the Customer record
        const [numRows] = await Customer.update(user, {            
            logging: false,   
            where: { customer_id: customerId },
            include: [{
                model: CustomerSettings,
                as: 'customer_settings',
                required: false
            }, {
                model: CustomerInformation,
                as: 'customer_information',
                required: false
            }]
        });
        // Return the updated User
        if (numRows > 0) {
            var data = {
                success: true
            }
            if(user.old_password && pass_change === true){
                data.password_change = true 
            }
            res.status(200).json({data});
        } else {
            res.status(200).json({err: "Kon niet wijzigen"});
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({err: error.message});
        Logger.log(1, error);
    }
};
