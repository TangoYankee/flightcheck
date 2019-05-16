var config = require('./config.js');
var request = require('request');
var messages = require('./block_message.js');
var delay_data = require('./delay.json'); //Test data
var flight_status_data = require('./flight_status.json'); //Test data
var track_data = require(`./track.json`); //Test data
var track_no_data = require('./track_no.json'); //Test data

var methods = {};
// Remove unused variables
methods.getFlightStatus = (callsign, res) => {
    var today = new Date();
    var carrier = callsign.match(/[a-zA-Z]+/)[0];
    var flight = callsign.match(/\d+/)[0];
    var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth() + 1}/${today.getUTCDate()}`;
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true" },
        method: 'GET',

    }, function (error, response, body) {
        body_json = JSON.parse(body);
        console.log(body_json.request.airline.error);
        if (error){
            // TODO: push to json help message
            res.send(error.toString())
        } else if (body_json.request.airline.error) {
            // TODO: push to json help message
            res.send(body_json.request.airline.error.toString());
        } else {
            res.json(messages.data.setStatusMessage(body_json));
        }
    })
}

methods.getFlightTrack = (callsign, res) => {
    var today = new Date();
    var carrier = callsign.match(/[a-zA-Z]+/)[0];
    var flight = callsign.match(/\d+/)[0];
    var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth() + 1}/${today.getUTCDate()}`;
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true" },
        method: 'GET',

    }, function (error, response, body) {
        body_json = JSON.parse(body);
        console.log(body_json);
        if (error) {
            // TODO: push to json help message
            res.send(error.toString());
        } else if (body_json.request.airline.error) {
            // TODO: push to json help message
            res.send(body_json.request.airline.error.toString());
        }
        else {
            res.json(messages.data.setTrackMessage(body_json));
        }
    })
}

methods.getDelayIndex = (identifier, res) => {
    uri = `https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/${identifier}`
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key },
        method: 'GET',

    }, function (error, response, body) {
        body_json = JSON.parse(body);
        if (error) {
            // TODO: push to json help message
            res.send(error.toString());
        } else if (body_json.error) {
            // TODO: push to json help message
            res.send(body_json.error.errorCode.toString());
        }else {
            res.json(messages.data.setDelayMessage(body_json));
        }
    })
}

// TODO: Remove developmental console.logs
methods.controlInput = (user_input, res) => {
    var user_input_split = user_input.split(' ');
    var commands = ["status", "position", "help"]; //Requests within /flightcheck slash command
    if (user_input_split.length == 2 || user_input_split.length == 1) {
        // Execute for status requests
        switch (user_input_split[0]) {
            case commands[0]:
                console.log("Looking for status")
                // TODO: Check that entry also contains letters
                if (user_input_split[1] && user_input_split[1].match(/\d+/)) {
                    console.log("exists and contains numbers")
                    methods.getFlightStatus(user_input_split[1], res);
                    // TODO: Check that entry also contains letters
                } else if (user_input_split[1]) {
                    console.log("exists but excludes numbers")
                    methods.getDelayIndex(user_input_split[1], res);
                } else {
                    // TODO: Format to JSON, push "send" to getHelpMessage
                    res.send(messages.data.setHelpMessage("please provide an aircraft callsign or airport identifier"))
                }
                break;
            case commands[1]:
                console.log("Looking for position")
                // Check whether the second position contains data
                // TODO: Check that entry also contains letters
                if (user_input_split[1] && user_input_split[1].match(/\d+/)) {
                    methods.getFlightTrack(user_input_split[1], res);
                    console.log("exists and contains numbers")
                    // Lookup aircraft track
                    // Any further errors will be checked by the API. They will sent as messages for the help message
                } else {
                    // TODO: Include in help message
                    // TODO: Format to JSON
                    res.send("please provide a valid aircraft callsign")
                }
                break;
            case commands[2]:
                // TODO: Format to JSON
                res.send(messages.data.setHelpMessage("Here you go!"))
                break;
            default:
                // TODO: Format to JSON
                res.send(messages.data.setHelpMessage("Command not recognized"))
        }

    } else {
        var message = `This message has an unexpected format. Please check the spacing in your command.`
        // TODO: Format to JSON
        res.send(messages.data.setHelpMessage(message))
    }
}

exports.data = methods;
