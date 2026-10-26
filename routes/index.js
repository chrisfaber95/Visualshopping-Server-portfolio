const routes = require('express').Router();

const product = require('./product');
routes.use('/product', product);

const info = require('./info');
routes.use('/info', info);

const user = require('./user');
routes.use('/user', user);

const customer = require('./customer');
routes.use('/customer', customer);

routes.use('/userroles', require('./userroles'));

const department = require('./department');
routes.use('/departments', department);

const order = require('./order');
routes.use('/order', order);

const shoppinglist = require('./shoppinglist');
routes.use('/shoppinglist', shoppinglist);

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

const spaaractie= require('./spaaractie');
routes.use('/spaaractie', spaaractie);

const customer_spaaractie= require('./customer_spaaractie');
routes.use('/customer_spaaractie', customer_spaaractie);

const actie_order = require('./actie_order');
routes.use('/actie_order', actie_order);

const customer_favorites= require('./customer_favorites');
routes.use('/customer_favorites', customer_favorites);


const order_information= require('./order_information');
routes.use('/order_information', order_information);

const feedback= require('./feedback');
routes.use('/feedback', feedback);

routes.get('/', (req, res) => {
    res.status(200).json({
        message: 'Connected'
    })
});

module.exports = routes;
