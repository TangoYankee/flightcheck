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
        // console.log(flights);
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

methods.getFlightInfo = function (call_sign){
    restclient.get(`${fxml_url}FlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign, howMany: 1}
    }).on('success', (result) => {
        var flights_info = result.FlightInfoResult;
        var flight_info = flights_info.flights[0];
        console.log(flight_info.ident);
        return flights_info.flights[0]
    });
}

methods.getInFlightInfo = function (res, call_sign, channel_id){
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result) => {
        // var inflight_info = result.InFlightInfoResult;
        console.log(inflight_info);
        return result.InFlightInfoResult;
        // res.send(`position of ${call_sign}\nLatitude: ${inflight_info.longitude}, Latitude: ${inflight_info.latitude}
        // \nhttps://www.google.com/maps/search/${inflight_info.latitude},${inflight_info.longitude}/@${inflight_info.latitude}059,-122.2704844,13z`);
    });
}

exports.data = methods;
