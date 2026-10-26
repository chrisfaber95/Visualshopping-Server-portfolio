const db = require('../../config/connection');

module.exports = (req, res) => {

    mollieClient.payments
    .get(req.body.id)
    .then(payment => {
      if (payment.isPaid()) {
        // Hooray, you've received a payment! You can start shipping to the consumer.
		  //  ordersdb.update({ payment: req.body.id }, { $set: { status: 'Paid' } }, { multi: false }, function (err, numReplaced) {


         //   sqlquery = "INSERT INTO `Information` (`page`, `subonderdeel_id`, `text`) VALUES ("+req.body.iPage + ", "+req.body.sId+ ", '"+req.body.iText+"');"
   




	//	})
      } else if (!payment.isOpen()) {
        // The payment isn't paid and has expired. We can assume it was aborted. 
		console.log("is not paid")
      }
      res.send(payment.status);
    })
    .catch(error => {
      // Do some proper error handling.
      res.send(error);
    });
  
 //   db.connection.query(sqlquery, function (err, result3){
//		if(err) throw err;
//		const info = result3;
 //       res.status(200).json({info});
//	})   
};
