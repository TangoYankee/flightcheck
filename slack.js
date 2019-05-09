var config = require('./config');
var request = require('request');

// Credentials
var clientId = config.slack.client_id;
var clientSecret = config.slack.client_secret;

var methods = {};

methods.oauth = function(req, res) {
    // When a user authorizes an app, pass a code query parameter on the oAuth endpoint. If that code is not there, respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Code not received."});
        console.log("Code not received.");
    } else {
        // A GET call to Slack's `oauth.access` endpoint- passing app's client ID, client secret, and the newly recieved code as query parameters.
        request({
            url: config.slack.url,
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
            method: 'GET',

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
}

exports.data = methods;
