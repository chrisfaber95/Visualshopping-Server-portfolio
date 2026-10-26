const routes = require('express').Router();

const product = require('./product');
routes.use('/product', product);

const user = require('./user');
routes.use('/user', user);

const department = require('./department');
routes.use('/departments', department);

const order = require('./order');
routes.use('/order', order);


const daytotals = require('./daytotals');
routes.use('/daytotals', daytotals);

const settings = require('./settings');
routes.use('/settings', settings);

const mollie = require('./mollie');
routes.use('/mollie', mollie);

const site = require('./site');
routes.use('/site', site);

const discounts= require('./discounts');
routes.use('/discounts', discounts);

routes.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected'
    })
});

module.exports = routes;
