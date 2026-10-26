const { Shop, Information, Address, Socials, Business_Hours } = require('../../store_models/index');
const { Op  } = require("sequelize");
const Logger = require('../../config/logging.js');
module.exports = async (req, res) => {
  const { shop_id, information, address, socials, business_hours } = req.body;
  const body = req.body
  try {

    await Business_Hours.bulkCreate(business_hours, {
        logging: false,
        paranoid: false,
        updateOnDuplicate: ["weekday", "week", "year", "default", "end", "start", "custom_label"],
    });

    const result = await Shop.update(
        body,
      {
        logging: console.log,
        where: { shop_id: shop_id },
        include: [
          {
            model: Information,
            as: "information",
            include: [{ model: Address, as: "address" }],
          },
          {
            model: Socials,
            as: "socials",
          },
          {
            model: Business_Hours,
            as: "business_hours",
          },
        ],        
        returning: true,
      }
    );

    console.log(result)
    // Get the updated Shop with its associations
    const updatedShop = await Shop.findOne({
      where: { shop_id },
      include: [
        {
          model: Information,
          as: 'information',
          include:[{
              model: Address,
              as: 'address'
          }]
        },
        {
          model: Socials,
          as: 'socials'
        },
        {
          model: Business_Hours,
          as: 'business_hours'
        }
      ],
    });
    
    res.status(200).json(updatedShop);
  } catch (err) {
    Logger.log(1, err)
    await t.rollback();
    res.status(400).json(err);
  }
}
