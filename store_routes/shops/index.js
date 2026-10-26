const info = require('express').Router();

const bodyParser = require('body-parser');
info.use(bodyParser.urlencoded({ extended:  true }));
info.use(bodyParser.json());

const all = require('./all');
const update = require('./update');
//const post = require('./post');

info.get('/', all)
info.put('/', update)


module.exports = info;