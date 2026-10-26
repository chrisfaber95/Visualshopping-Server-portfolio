const Logger = require('../../config/logging.js')
const { Op, literal, fn } = require('sequelize');
const { Order } = require('../../models/index');

module.exports = async (req, res) => {
	const pickupDate = new Date(req.params.date);
	const startOfDayPickupDate = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());

	try {
	  const ordersByPickupTime = await Order.findAll({
		attributes: [
		  [fn('TIME', literal('pickupTime')), 'pickupTime'],
		  [fn('COUNT', '*'), 'orderCount'],
		],
		where: {
		  pickupDate: {
			[Op.gte]: startOfDayPickupDate,
			[Op.lt]: new Date(startOfDayPickupDate.getTime() + 24 * 60 * 60 * 1000), // add 1 day to include orders until midnight
		  },
		},
		group: [fn('TIME', literal('pickupTime'))],
	  });
  
	  res.status(200).json(ordersByPickupTime);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Internal server error' });
	}
};

