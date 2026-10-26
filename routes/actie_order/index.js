const order = require('express').Router();

const bodyParser = require('body-parser');
order.use(bodyParser.urlencoded({ extended:  true }));
order.use(bodyParser.json());

const all = require('./all');
const single = require('./single');
const remove = require('./delete');
const post = require('./post');
const update = require('./update');
const product = require('./product');
const count = require('./count');

order.get('/', all);
order.get('/:date', all);
order.get('/count/:date', count);
order.get('/single/:orderId', single)
order.get('/product/:orderId', product)
order.delete('/:orderId', remove)
order.post('/', post)
order.put('/:orderId', update)


module.exports = order;
