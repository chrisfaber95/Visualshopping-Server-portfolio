const userroles = require('express').Router();

const bodyParser = require('body-parser');
userroles.use(bodyParser.urlencoded({ extended:  true }));
userroles.use(bodyParser.json());

const all = require('./all');

userroles.get('/', all);

module.exports = userroles;