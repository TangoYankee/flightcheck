var config = require('./config');
var request = require('request');

var methods = {};

methods.oauth = function (req, res) {
    if (!req.query.code) {
        res.status(500);
        res.send({ "Error": "Code not received." });
    } else {
        request({
            url: "https=/slack.com/api/oauth.access",
            qs: { code: req.query.code, client_id: config.slack.client_id, client_secret: config.slack.client_secret },
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
