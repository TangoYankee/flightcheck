const flightstats = require('./apps/flightcheck/flightstats.js');
const slack = require('./apps/slack/slack.js');

const markdownlinks = require('./apps/markdownlinks/markdownlinks.js');
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
    response.sendFile(path.join(__dirname + '/templates/markdownlinks.html'))
});

app.get('/oauth', (request, response) => {
    slack.data.oauth(request, response);
});

app.post('/flightcheck', (request, response) => {
    flightstats.data.controlInput(request.body.text, response);
});

app.post('/markdownlinks', (request, response) => {
    markdownlinks.data.simpleLinks(request.body, response);
});

app.post('/confirm' , (request, response) => {
    markdownlinks.data.composeFinalMessage(JSON.parse(request.body.payload), response);
    // Function to direct response to message
    var json_payload = JSON.parse(request.body.payload);
    console.log(`payload: ${json_payload.response_url}`);
})
