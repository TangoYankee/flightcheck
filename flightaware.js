var config = require('./config');
var restclient = require('restler');

const username = config.flight_aware.user;
const apiKey = config.flight_aware.key;
const fxml_url = config.flight_aware.url

var methods = {};

methods.getEnroute = function(res, airport){
    restclient.get(`${fxml_url}Enroute`, {
        username: username,
        password: apiKey,
        query: {airport: airport, howMany: 15, order: 'estimatedarrivaltime', sort: 'DSC'}
    }).on('success', (result) => {
        var flights = result.EnrouteResult.enroute;
        var schedule = [];
        var count = 0;
        flights.forEach((flight, index) => {
            schedule[index] = `\ncall sign: ${flight.ident}, depart time: ${flight.actualdeparturetime}`;
            count++
        });
        if (count == flights.length){
            res.send(`${airport} schedule${schedule}`)
        }        
    });
}

methods.getInFlightInfo = function (res, call_sign){
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result) => {
        var flight_info = result.InFlightInfoResult;
        res.send(`position of ${call_sign}\nLatitude: ${flight_info.longitude}, Latitude: ${flight_info.latitude}
        \nhttps://www.google.com/maps/search/${flight_info.latitude},${flight_info.longitude}/@${flight_info.latitude}059,-122.2704844,13z`);
    });
}

exports.data = methods;
