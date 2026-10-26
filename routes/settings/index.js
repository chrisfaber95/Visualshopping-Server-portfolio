const settings = require('express').Router();

const bodyParser = require('body-parser');
settings.use(bodyParser.urlencoded({ extended:  true }));
settings.use(bodyParser.json());

const rights = require('./rights');
const language = require('./language');

settings.get('/rights', rights)
settings.get('/language', language)


module.exports = settings;