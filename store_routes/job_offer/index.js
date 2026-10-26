const info = require('express').Router();

const bodyParser = require('body-parser');
info.use(bodyParser.urlencoded({ extended:  true }));
info.use(bodyParser.json());

const all = require('./all');
//const post = require('./post');

info.get('/', all)
//info.post('/post', post)


module.exports = info;