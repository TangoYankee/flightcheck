const flightstats = require('./flightstats.js')
const slack = require('./slack.js');
var config = require('./config.js');
const package = require('./package.json')

var express = require('express');
const bodyParser = require('body-parser');

var app = express();
const PORT = config.port;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT);

app.get('/', (req, res) => {
    res.send(`${package.name} is working on ngrok. hit path "${req.url}" at port ${PORT}`)
});

app.get('/oauth', (req, res) => {
    slack.data.oauth(req, res);
});

app.post('/flightcheck', (req, res) => {
    flightstats.data.controlInput(req.body.text, res)
});
