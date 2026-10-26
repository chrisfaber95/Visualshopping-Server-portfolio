const express = require('express');
const https = require('https');
const routes = require('./routes');
const app = express();
const moment = require('moment');
const multer = require('multer');
const path = require('path')
const fs = require("fs");
const csv = require('fast-csv');
const mysql = require('mysql');
require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "1mb"}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true, parameterLimit:1000}));

const Logger = require('./config/logging.js')

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

app.use(express.static('public'));
app.use('/api/', routes);
try {
    const port = process.env.PORT || 3001;
    https.createServer({
                key: fs.readFileSync(path.resolve('./key.pem')),
                cert: fs.readFileSync(path.resolve('./cert.pem')),
                passphrase: 'wachtwoord'
            },
            app)
        .listen(port);
    Logger.log(2, 'Starting Server at port 3001')
} catch (err) {
    Logger.log(1, err)
}
//app.listen(3000, () => console.log('listening at port 3000'));