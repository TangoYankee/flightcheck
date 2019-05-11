const flightAware = require('./flightaware.js');
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

app.post('/inflightinfo', (req, res)=>{
    var call_sign = req.body.text
    flightAware.data.getInFlightInfo(res, call_sign);
});

app.post('/enroute', (req, res)=>{
    var airport = req.body.text
    flightAware.data.getEnroute(res, airport);
});
