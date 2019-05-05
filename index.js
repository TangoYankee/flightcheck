const flightAware = require('./flight-aware.js');
var config = require('./config');

var express = require('express');
var request = require('request');
const bodyParser = require('body-parser');

var restclient = require('restler');

// FlightAware
const username = config.flight_aware.user;
const apiKey = config.flight_aware.key;
var fxml_url = config.flight_aware.url;

// Slack
var clientId = config.slack.client_id;
var clientSecret = config.slack.client_secret;

var app = express();
const PORT = config.port;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});

app.get('/', (req, res) => {
    res.send(`Ngrok is working! Path Hit: ${req.url}`)
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: config.slack.url, //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
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

