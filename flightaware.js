var config = require('./config');
var restclient = require('restler');

const username = config.flight_aware.user;
const apiKey = config.flight_aware.key;
const fxml_url = config.flight_aware.url

var methods = {};

methods.getEnroute = function(airport){
    restclient.get(`${fxml_url}Enroute`, {
        username: username,
        password: apiKey,
        query: {airport: airport, howMany: 15, order: 'estimatedarrivaltime', sort: 'DSC'}
    }).on('success', (result, response) => {
        var flights = result.EnrouteResult.enroute;
        // var schedule = [];
        // entries.forEach((entry, index) => {
        //     console.log(`Aircraft Call Sign: ${entry.ident}, Depart Time: ${entry.actualdeparturetime}`);
        //     // schedule + `Aircraft Call Sign: ${entry.ident}, Depart Time: ${entry.actualdeparturetime}`;
        //     // console.log(schedule)
        // });
        return flights        
    });
}

methods.getInFlightInfo = function (call_sign){
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result, response) => {
        var entry = result.InFlightInfoResult;
        // console.log(`Call Sign: ${entry.ident}; long, lat: ${entry.longitude}, ${entry.latitude}; update type: ${entry.updateType}`);
        return `Call Sign: ${entry.ident}; long, lat: ${entry.longitude}, ${entry.latitude}; update type: ${entry.updateType}`;   
    });
}

exports.data = methods;
