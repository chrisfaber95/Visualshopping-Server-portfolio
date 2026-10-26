const user = require('express').Router();

const bodyParser = require('body-parser');
user.use(bodyParser.urlencoded({ extended:  true }));
user.use(bodyParser.json());

const all = require('./all');
const single = require('./single');
const employ = require('./employee');
const login = require('./login')
const register = require('./register')
const update = require('./update')
const add = require('./add')

user.get('/', all);
user.get('/:userId', single)
user.get('/employ/:userId', employ)
user.post('/login', login)
user.post('/register', register)
user.post('/', add)
user.put('/update/:userId', update)

module.exports = user;