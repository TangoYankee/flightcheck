const flightAware = require('./flightaware.js');
const slack = require('./slack.js');
var config = require('./config');

var express = require('express');
const bodyParser = require('body-parser');

var restclient = require('restler');

// FlightAware
const username = config.flight_aware.user;
const apiKey = config.flight_aware.key;
var fxml_url = config.flight_aware.url;

var app = express();
const PORT = config.port;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`slack-flightaware listening on port ${PORT}`)
});

app.get('/', (req, res) => {
    res.send(`Ngrok is working! Path Hit: ${req.url}`)
});

app.get('/oauth', (req, res) => {
    slack.oauth(req, res);
});

app.post('/inflightinfo', (req, res)=>{
    var call_sign = req.body.text
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result, response) => {
        var flight = result.InFlightInfoResult;
        flight_string = `Call Sign: ${flight.ident}; long, lat: ${flight.longitude}, ${flight.latitude}; update type: ${flight.updateType}`;
        res.send(flight_string);
    });
});

app.post('/enroute', (req, res)=>{
    var airport = req.body.text
    restclient.get(`${fxml_url}Enroute`, {
        username: username,
        password: apiKey,
        query: {airport: airport, howMany: 15, order: 'estimatedarrivaltime', sort: 'DSC'}
    }).on('success', (result, response) => {
        var flights = result.EnrouteResult.enroute;
        var schedule = "Early Send"
        flights.forEach(flight=> {
            console.log(`Aircraft Call Sign: ${flight.ident}, Depart Time: ${flight.actualdeparturetime}`);
        });
        res.send(`Call Sign: ${flights[0].ident}, Depart Time: ${flights[0].actualdeparturetime}`)
    });
});

