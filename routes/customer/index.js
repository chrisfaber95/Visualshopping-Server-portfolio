const user = require('express').Router();

const bodyParser = require('body-parser');
user.use(bodyParser.urlencoded({ extended:  true }));
user.use(bodyParser.json());

const auth = require('../middleware/auth');
const c_auth = require('../middleware/customer_auth');


const all = require('./all');
const single = require('./single');
const employee = require('./employee');
const employeeAll = require('./employeeAll');
const login = require('./login')
const register = require('./register')
const passwordreset = require('./passwordreset')
const update = require('./update')
const add = require('./add')
const destroy = require('./destroy')

user.get('/', all)
user.get('/single/', c_auth, single)
user.get('/employee', auth, employee)
user.get('/employee-all', auth, employeeAll)
user.post('/login', login)
user.post('/register', register)
user.post('/passwordreset', passwordreset)
user.post('/', add)
user.put('/', c_auth, update)
user.delete('/', destroy)

module.exports = user;