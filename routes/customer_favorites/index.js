const favorite = require('express').Router();

const bodyParser = require('body-parser');
favorite.use(bodyParser.urlencoded({ extended:  true }));
favorite.use(bodyParser.json());

const all = require('./all');
const del = require('./delete')
const add = require('./post')

favorite.get('/', all)
favorite.post('/', add)
favorite.delete('/', del)

module.exports = favorite;