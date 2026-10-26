const jobofffer = require('express').Router();

const bodyParser = require('body-parser');
jobofffer.use(bodyParser.urlencoded({ extended:  true }));
jobofffer.use(bodyParser.json());

const add = require('./post')
jobofffer.post('/', add)

module.exports = jobofffer;