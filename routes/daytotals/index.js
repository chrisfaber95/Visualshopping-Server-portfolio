const daytotals = require('express').Router();

const bodyParser = require('body-parser');
daytotals.use(bodyParser.urlencoded({ extended:  true }));
daytotals.use(bodyParser.json());

const all = require('./all');
const post = require('./post');

daytotals.get('/', all);
daytotals.get('/:date', all);
daytotals.post('/', post)


module.exports = daytotals;
