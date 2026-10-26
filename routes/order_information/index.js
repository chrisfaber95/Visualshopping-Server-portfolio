const order_information = require('express').Router();

const bodyParser = require('body-parser');
order_information.use(bodyParser.urlencoded({ extended:  true }));
order_information.use(bodyParser.json());

const all = require('./all');
const destroy = require('./delete');

order_information.get('/', all);
order_information.delete('/', destroy);


module.exports = order_information;
