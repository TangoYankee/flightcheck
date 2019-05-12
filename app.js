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
    var channel_id = req.body.channel_id
    flightAware.data.getInFlightInfo(res, call_sign, channel_id);
    var flight_info = flightAware.data.getFlightInfo(call_sign);
    var inflight_info = flightAware.data.getInFlightInfo(call_sign);
    if (flight_info && inflight_info) {
        var message = {
        "channel": `${channel_id}`,
        "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `
                        *Call Sign:* ${flight_info.ident}
                        *Type Aircraft:* ${flight_info.aircrafttype}
                        *Filed Departure Time:* ${flight_info.filed_departuretime}
                        *Actual Depature Time:* ${flight_info.actualdeparturetime}
                        *Estimated Arrival Time:* ${flight_info.estimatedarrivaltime}
                        *Actual Arrival Time*: ${flight_info.actualarrivaltime}
                        *Diverted:* ${flight_info.diverted}
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
});

app.post('/enroute', (req, res)=>{
    var airport = req.body.text
    flightAware.data.getEnroute(res, airport);
});
