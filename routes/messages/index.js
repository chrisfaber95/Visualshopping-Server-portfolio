const message = require('express').Router();

const bodyParser = require('body-parser');
message.use(bodyParser.urlencoded({ extended:  true }));
message.use(bodyParser.json());

const all = require('./all');
const single = require('./single');
const remove = require('./delete');
const post = require('./post');
const update = require('./update');

message.get('/:userId', all);
message.get('/single/:userId', single)
message.delete('/delete/:messageId', remove)
message.post('/post', post)
message.put('/:messageId', update)


module.exports = message;