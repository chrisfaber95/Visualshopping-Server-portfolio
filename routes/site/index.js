const site = require('express').Router();

const bodyParser = require('body-parser');
site.use(bodyParser.urlencoded({ extended: true }));
site.use(bodyParser.json());

const site1 = require('./site');
const cookies = require('./cookies');

site.get('/site', site1);
site.post('/cookies', cookies)


module.exports = site;