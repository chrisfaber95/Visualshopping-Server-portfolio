const job_application = require('express').Router();

const bodyParser = require('body-parser');
job_application.use(bodyParser.urlencoded({ extended:  true }));
job_application.use(bodyParser.json());

const add = require('./post')
job_application.post('/', add)

module.exports = job_application;