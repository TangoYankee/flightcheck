var config = require('./config.js');
var request = require('request');
var messages = require('./block_message.js');

const commands = ["status", "position", "help"];
var methods = {};


methods.getFlightStatus = (callsign, res) => {
    var today = new Date();
    var carrier = callsign.match(/[a-zA-Z]+/)[0];
    var flight = callsign.match(/\d+/)[0];
    // var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth() + 1}/${today.getUTCDate()}`;
    var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "false" },
        method: 'GET',

    }, function (error, response, body) {
        var body_json = JSON.parse(body);
        if (error) {
            res.json(messages.date.setHelpMessage(error.toString()));
        } else if (body_json.request.airline.error) {
            res.json(messages.date.setHelpMessage(body_json.request.airline.error.toString()));
        } else {
            res.json(messages.data.setStatusMessage(body_json));
        }
    })
}

methods.getFlightTrack = (callsign, res) => {
    var today = new Date();
    var carrier = callsign.match(/[a-zA-Z]+/)[0];
    var flight = callsign.match(/\d+/)[0];
    // var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth() + 1}/${today.getUTCDate()}`;
    var uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/${carrier}/${flight}/dep/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "false" },
        method: 'GET',

    }, function (error, response, body) {
        var body_json = JSON.parse(body);
        if (error) {
            res.json(messages.date.setHelpMessage(error.toString()));
        } else if (body_json.request.airline.error) {
            res.json(messages.date.setHelpMessage(body_json.request.airline.error.toString()));
        }
        else {
            res.json(messages.data.setTrackMessage(body_json));
        }
    })
}

methods.getDelayIndex = (identifier, res) => {
    var uri = `https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/${identifier}`
    request({
        url: uri,
        qs: { appId: config.flightstats.app_id, appKey: config.flightstats.key },
        method: 'GET',

    }, function (error, response, body) {
        var body_json = JSON.parse(body);
        if (error) {
            res.json(messages.date.setHelpMessage(error.toString()));
        } else if (body_json.error) {
            res.json(messages.date.setHelpMessage(body_json.error.errorCode.toString()));
        } else {
            res.json(messages.data.setDelayMessage(body_json));
        }
    })
}

methods.controlInput = (user_input, res) => {
    var user_input_split = user_input.split(' ');
    if (user_input_split.length == 2 || user_input_split.length == 1) {
        switch (user_input_split[0]) {
            case commands[0]:
                if (user_input_split[1] && user_input_split[1].match(/\d+/) && user_input_split[1].match(/[a-zA-Z]+/)) {
                    methods.getFlightStatus(user_input_split[1], res);
                } else if (user_input_split[1] && user_input_split[1].match(/[a-zA-Z]+/)) {
                    methods.getDelayIndex(user_input_split[1], res);
                } else {
                    res.json(messages.data.setHelpMessage("please provide an aircraft callsign or airport identifier"))
                }
                break;
            case commands[1]:
                if (user_input_split[1] && user_input_split[1].match(/\d+/) && user_input_split[1].match(/[a-zA-Z]+/)) {
                    methods.getFlightTrack(user_input_split[1], res);
                } else {
                    res.json(messages.date.setHelpMessage("please provide a valid aircraft callsign"));
                }
                break;
            case commands[2]:
                res.json(messages.data.setHelpMessage("Welcome to Flightcheck!"))
                break;
            default:
                res.json(messages.data.setHelpMessage("Selected option not recognized"))
        }

    } else {
        res.json(messages.data.setHelpMessage('This message has an unexpected format. Please check the spacing in your command.'))
    }
}

exports.data = methods;
