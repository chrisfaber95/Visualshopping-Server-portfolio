const feedback = require('express').Router();

const bodyParser = require('body-parser');
feedback.use(bodyParser.urlencoded({ extended:  true }));
feedback.use(bodyParser.json());

const add = require('./send')
feedback.post('/', add)

module.exports = feedback;