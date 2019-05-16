var config = require('./config.js');
var request = require('request');
var messages = require('./block_message.js');
var delay_data = require('./delay.json'); //Test data
var flight_status_data = require('./flight_status.json'); //Test data
var track_data = require(`./track.json`); //Test data
var track_no_data = require('./track_no.json'); //Test data

var methods = {};

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

// Three requests:


req_one = "status aa100";
req_two = "status sfo";
req_three = "position aa100";

methods.getFlightStatus = (callsign) => {
    // request({
//     url: uri,
//     qs: {appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true"},
//     method: 'GET',

// }, function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })
    return messages.data.setStatusMessage(flight_status_data)
}

methods.getFlightTrack = (callsign) => {
    // request({
//     url: uri,
//     qs: {appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true"},
//     method: 'GET',

// }, function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })
    return messages.data.setTrackMessage(track_data)
}

methods.getDelayIndex = (identifier) => {
    // request({
//     url: uri,
//     qs: {appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true"},
//     method: 'GET',

// }, function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })
    return messages.data.setDelayMessage(delay_data);
}


methods.controlInput = (user_input, res) => {
    var user_input_split = user_input.split(' ');
    var commands = ["status", "position", "help"]; //Requests within /flightcheck slash command
    if (user_input_split.length == 2 || user_input_split.length == 1) {
        // Execute for status requests
        switch (user_input_split[0]) {
            case commands[0]:
                console.log("Looking for status")
                if (user_input_split[1] && user_input_split[1].match(/\d+/)) {
                    // TODO lookup flight status
                    // Any further errors will be checked by the API. They will sent as messages for the help message
                    // res.send(getFlightStatus(user_input_split[1]))
                    console.log("exists and contains numbers")
                } else if (user_input_split[1]) {
                    console.log("exists but excludes numbers")
                    //TODO lookup airport delay index
                    // Any further errors will be checked by the API. They will sent as messages for the help message
                } else {
                    console.log(messages.data.setHelpMessage("please provide an aircraft callsign or airport identifier"))
                }
                break;
            case commands[1]:
                console.log("Looking for position")
                // Check whether the second position contains data
                if (user_input_split[1]) {
                    console.log("exists")
                    // Lookup aircraft track
                    // Any further errors will be checked by the API. They will sent as messages for the help message
                } else {
                    console.log("please provide an aircraft callsign")
                }
                break;
            case commands[2]:
                console.log(messages.data.setHelpMessage("Here you go!"))
                break;
            default:
                console.log(messages.data.setHelpMessage("Command not recognized"))
        }

    } else {
        var message = `This message has an unexpected format. Please check the spacing in your command.`
        console.log(messages.data.setHelpMessage(message))
    }
}

exports.data = methods;
