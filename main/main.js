const flightstats = require('./apps/flightcheck/flightstats.js');
const slack = require('./apps/slack/slack.js');
const simple_links = require('./apps/simplelinks/simple_links.js');
var config = require('./config.js');

var express = require('express');
const bodyParser = require('body-parser');

var app = express();
var path = require('path');
var __dirname;
const PORT = config.port;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/index.html'))
});

app.get('/oauth', (req, res) => {
    slack.data.oauth(req, res);
});

app.post('/flightcheck', (req, res) => {
    flightstats.data.controlInput(req.body.text, res);
});

app.post('/simplelinks', (req, res)=> {
    simple_links.data.simpleLinks(req.body.text, req.body.response_url, res);
    console.log(req.body.text)
});
