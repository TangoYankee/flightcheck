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

methods.getFlightInfo = (resolve, call_sign) => {
    restclient.get(`${fxml_url}FlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign, howMany: 1}
    }).on('success', (result) => {
        var flights_info = result.FlightInfoResult;
        resolve (flights_info.flights[0]);
    });
}

methods.getInFlightInfo = (resolve, call_sign) => {
    restclient.get(`${fxml_url}InFlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: call_sign}
    }).on('success', (result) => {
        resolve (result.InFlightInfoResult);
    });
}

methods.sendMessage = (res, flight_info, inflight_info) => {
    var milli_to_sec = 1000;
    var filed_departuretime = new Date(flight_info.filed_departuretime*milli_to_sec).toUTCString();
    var actualdeparturetime = new Date(inflight_info.departureTime*milli_to_sec).toUTCString();
    var estimatedarrivaltime = new Date(flight_info.estimatedarrivaltime*milli_to_sec).toUTCString();
    var actualarrivaltime_epoch = inflight_info.arrivalTime;
    if (actualarrivaltime_epoch == 0){
        var actualarrivaltime = "still in flight";
    }else{
        var actualarrivaltime = new Date(actualarrivaltime_epoch*milli_to_sec).toUTCString();
    }
    if (flight_info.diverted){
        var diverted = "yes"
    } else {
        var diverted = "no"
    }
    var message = {
        // "channel": `${channel_id}`,
        "response_type": "in_channel",
        "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `
                    *Call Sign:* ${flight_info.ident}
                    *Type Aircraft:* ${flight_info.aircrafttype}
                    *Filed Departure Time:* ${filed_departuretime}
                    *Actual Depature Time:* ${actualdeparturetime}
                    *Estimated Arrival Time:* ${estimatedarrivaltime}
                    *Actual Arrival Time*: ${actualarrivaltime}
                    *Diverted:* ${diverted}
                    *Origin:* ${flight_info.originName}, ${flight_info.originCity} (${flight_info.origin})
                    *Destination:* ${flight_info.destinationName}, ${flight_info.destinationCity} (${flight_info.destination})`
                    }
                },
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        "text": `${flight_info.ident} map preview`,
                        "emoji": true
                    },
                    "image_url": `https://open.mapquestapi.com/staticmap/v5/map?locations=${inflight_info.latitude},${inflight_info.longitude}&size=@2x&zoom=8&key=${config.mapquest.maps_key}`,
                    "alt_text": "map of aircraft"
                }
            ],
        "attachments": [
            {
            "fallback": `View your flights at https://www.openstreetmap.org/?mlat=${inflight_info.latitude}&mlon=${inflight_info.longitude}&zoom=9#map=9/${inflight_info.latitude}/${inflight_info.longitude}`,
            "actions": [
                {
                "type": "button",
                "text": "View full map",
                "url": `https://www.openstreetmap.org/?mlat=${inflight_info.latitude}&mlon=${inflight_info.longitude}&zoom=9#map=9/${inflight_info.latitude}/${inflight_info.longitude}`
                }
            ]
            }
        ]
    }
    res.json(message)
}

methods.test = () => {
    restclient.get(`${fxml_url}FlightInfo`, {
        username: username,
        password: apiKey,
        query: {ident: "asa1927", howMany: 15}
    }).on('success', (result) => {
        var milli_to_sec = 1000;
        var flight_plans = result.FlightInfoResult.flights;
        flight_plans.forEach(flight_plan => {
            var filed_dep_time = new Date(flight_plan.filed_departuretime*milli_to_sec).toUTCString();
            var actualdeparturetime = new Date(flight_plan.actualdeparturetime*milli_to_sec).toUTCString();
            console.log(`Call Sign: ${flight_plan.ident} Type Aircraft: ${flight_plan.aircrafttype} Filed dep time: ${filed_dep_time} Actual Dep Time: ${actualdeparturetime} Origin:${flight_plan.origin} Dest: ${flight_plan.destination}`);
        });
    });
}

exports.data = methods;
