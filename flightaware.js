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
    }).on('success', (result, response) => {
        var entries = result.EnrouteResult.enroute;
        var schedule = "";
        var count = 0;
        entries.forEach((entry, index) => {
            var flight = `Aircraft Call Sign: ${entry.ident}, Depart Time: ${entry.actualdeparturetime} \n` 
            count++
            // TODO: Create a well formatted message for enRoute flights
            schedule + flight;
            console.log(schedule);
        });
        console.log(schedule)
        if (count == entries.length){
            res.send(count.toString())
        }        
    });
}

methods.getInFlightInfo = function (res, call_sign){
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result, response) => {
        var entry = result.InFlightInfoResult;
        var flight_string = `Call Sign: ${entry.ident}; long, lat: ${entry.longitude}, ${entry.latitude}; update type: ${entry.updateType}`
        console.log(`module ${flight_string}`);
        res.send(flight_string);
    });
}

exports.data = methods;
