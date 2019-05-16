// const flightAware = require('./flightaware.js');
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

// app.post('/inflightinfo', (req, res)=>{
//     // Retrieve flight and inflight information simultaneously. 
//     // The alternative is only getting inflight info after checking
//     // from flight info that the aircraft is actually in the air.
//     // It increases costs in unneccessary API calls. However, it 
//     // saves time when both calls were needed.
//     var call_sign = req.body.text
//     var channel_id = req.body.channel_id
//     var flight_info = new Promise ((resolve) => {flightAware.data.getFlightInfo(resolve, call_sign)} );
//     var inflight_info = new Promise ((resolve) => {flightAware.data.getInFlightInfo(resolve, call_sign)});
//     Promise.all([flight_info, inflight_info]).then(values => {
//         flight_info = values[0];
//         inflight_info = values[1];
//         flightAware.data.sendMessage(res, flight_info, inflight_info, channel_id)
//     })
// });

// app.post('/enroute', (req, res)=>{
//     var airport = req.body.text
//     flightAware.data.getEnroute(res, airport);
// });

app.post('/flightcheck', (req, res) => {
    flightstats.data.controlInput(req.body.text, res)
});
