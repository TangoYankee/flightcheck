var config = require('./config.js');
var request = require('request');
var messages = require('./block_message.js');
var delay_data = require('./delay.json'); //Test data
var flight_status_data = require('./flight_status.json'); //Test data
var track_data = require(`./track.json`); //Test data
var track_no_data = require('./track_no.json'); //Test data

// console.log(messages.data.setDelayMessage(delay_data));
// console.log(messages.data.setStatusMessage(flight_status_data));
// console.log(messages.data.setTrackMessage(track_no_data));
// console.log(messages.data.setTrackMessage(track_data));

// uri = "https://api.flightstats.com/flex/flightstatus/{protocol}/v2/json/flight/status/{carrier}/{flight}/arr/{year}/{month}/{day}"

// var today = new Date();
// var call_sign = "AA 100"
// var carrier = call_sign.match(/[a-zA-Z]+/)[0];
// var flight = call_sign.match(/\d+/)[0];

// Use UTC time to ease concerns about where the source of the "local time" is
// Offset month by one, as Node's Month in Date starts at 0?!
// uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth()+1}/${today.getUTCDate()}`
// method = 'GET'

// request({
//     url: uri,
//     qs: {appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true"},
//     method: 'GET',

// }, function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })
