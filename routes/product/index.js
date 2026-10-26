const product = require('express').Router();

const bodyParser = require('body-parser');
product.use(bodyParser.urlencoded({ extended:  true }));
product.use(bodyParser.json());

const all = require('./all');
const single = require('./single');
const search = require('./search');
const remove = require('./delete');
const post = require('./post');
const update = require('./update');
const scanner = require('./scanner');

product.get('/', all);
product.get('/:productId', single)
product.get('/search/:search', search)
product.delete('/delete/:productId', remove)
product.post('/post', post)
product.put('/update/:productId', update)
product.post('/scanner', scanner)


module.exports = product;