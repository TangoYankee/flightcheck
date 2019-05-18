var config = require('./config');
var request = require('request');

var clientId = config.slack.client_id;
var clientSecret = config.slack.client_secret;

var methods = {};

methods.oauth = function (req, res) {
    if (!req.query.code) {
        res.status(500);
        res.send({ "Error": "Code not received." });
    } else {
        request({
            url: config.slack.url,
            qs: { code: req.query.code, client_id: clientId, client_secret: clientSecret },
            method: 'GET',

        }, function (error, body) {
            if (error) {
                res.send(error.toString());
            } else {
                res.json(body);

            }
        })
    }
}

exports.data = methods;
