const user = require('express').Router();

const bodyParser = require('body-parser');
user.use(bodyParser.urlencoded({ extended:  true }));
user.use(bodyParser.json());
const auth = require('../middleware/auth');

const all = require('./all');
const single = require('./single');
const update = require('./update')
const add = require('./add')

user.get('/', all);
user.get('/:actieId', single)
user.post('/', add)
user.put('/', update)

module.exports = user;