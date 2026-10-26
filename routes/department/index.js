const department = require('express').Router();

const bodyParser = require('body-parser');
department.use(bodyParser.urlencoded({ extended:  true }));
department.use(bodyParser.json());

const all = require('./all');
const single = require('./single');
const remove = require('./delete');
const post = require('./post');
const update = require('./update');

department.use('/', all);
department.get('/single/:productId', single)
department.delete('/delete/:departmentId', remove)
department.post('/post', post)
department.put('/update/:departmentId', update)


module.exports = department;