const mollie = require('express').Router();

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_TEST_API });

const bodyParser = require('body-parser');
mollie.use(bodyParser.urlencoded({ extended:  true }));
mollie.use(bodyParser.json());

const webhook = require('./webhook');

mollie.post('/webhook', webhook);


module.exports = mollie;