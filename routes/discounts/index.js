const discounts = require('express').Router();

const bodyParser = require('body-parser');
discounts .use(bodyParser.urlencoded({ extended:  true }));
discounts .use(bodyParser.json());
discounts.use(bodyParser.json({ limit: '1mb' }));
discounts.use(bodyParser.urlencoded({ limit: '1mb', extended: true, parameterLimit:1000}));

const multer = require("multer")
const path = require('path')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/sales/uploads');
     },
    filename: function (req, file, cb) {
        cb(null , new Date().toISOString() + file.originalname);
    }
});

const upload = multer({
	storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.jpeg') {
            return callback(new Error('Only jpeg are allowed'))
        }
        callback(null, true)
    },
	limits:{
		fileSize: 5000000
	}
})

const all = require('./all');
const types = require('./types');
const images = require('./images');
const get_images = require('./get_images');


discounts.get('/', all);
discounts.get('/types', types);
discounts.post('/images', upload.array('sales'), images);
discounts.get('/get_images', get_images);
discounts.get('/get_images/:imgId', get_images);


module.exports = discounts ; 