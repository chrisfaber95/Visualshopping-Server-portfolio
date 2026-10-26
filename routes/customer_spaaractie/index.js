const user = require('express').Router();

const bodyParser = require('body-parser');
user.use(bodyParser.urlencoded({ extended:  true }));
user.use(bodyParser.json());
const auth = require('../middleware/auth');

const all = require('./all');
const single = require('./single');
const update = require('./update')
const employeeupdate = require('./employeeupdate')
const employeechange = require('./employeechange')
const nostamps = require('./nostamps')
const add = require('./add')
const reminder = require('./reminder')

user.get('/', all);
user.get('/:customerId', single)
user.post('/', add)
user.put('/', update)
user.put('/employeeupdate', auth, employeeupdate)
user.put('/employeechange', auth, employeechange)
user.put('/nostamps', auth, nostamps)
user.get('/reminder', reminder)

module.exports = user;