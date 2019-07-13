const flightstats = require('./apps/flightcheck/flightstats.js');
const slack = require('./apps/slack/slack.js');
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

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/templates/index.html'))
});

app.get('/oauth', (request, response) => {
    slack.data.oauth(request, response);
});

app.post('/flightcheck', (request, response) => {
    flightstats.data.controlInput(request.body.text, response);
});
