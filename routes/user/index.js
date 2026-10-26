const user = require('express').Router();

const bodyParser = require('body-parser');
user.use(bodyParser.urlencoded({ extended:  true }));
user.use(bodyParser.json());
const auth = require('../middleware/auth');

const all = require('./all');
const single = require('./single');
const employ = require('./employee');
const login = require('./login')
const register = require('./register')
const update = require('./update')
const add = require('./add')

user.get('/', auth, all);
user.get('/single/:userId', single)
user.get('/employ/:userId', auth, employ)
user.post('/login', login)
user.post('/register', register)
user.post('/', auth, add)
user.put('/', auth, update)

module.exports = user;