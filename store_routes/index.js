const store_routes = require('express').Router();

const job_application = require('./job_application');
store_routes.use('/job_application', job_application);

const job_offer = require('./job_offer');
store_routes.use('/job_offer', job_offer);

const timeslot = require('./timeslot');
store_routes.use('/timeslot', timeslot);

const business_hours = require('./business_hours');
store_routes.use('/business_hours', business_hours);

const delivery_location = require('./delivery_location');
store_routes.use('/delivery_location', delivery_location);

const shops = require('./shops');
store_routes.use('/shops', shops);

const terms = require('./terms_and_conditions');
store_routes.use('/terms', terms);

store_routes.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected'
    })
});

module.exports = store_routes;
