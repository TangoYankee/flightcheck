var request = require('request');
var messages = require('./messages.js');
var format = require('./format.js');
var methods = {};

methods.simpleLinks = (req_body, req_response_url, response) => {
    if (req_body.trim() == "help") {
        response.json(messages.data.help("Welcome to Simple Links"))
    } else if (req_body) {
        response.send()
        format_body = format.data.formatLinks(req_body);
        response_body_preview = messages.data.preview(format_body);
        methods.sendPreview(response_body_preview, req_response_url);
    } else {
        response.json(messages.data.help("please provide input"))
    }
}

methods.sendPreview = (response_body_preview, req_response_url) => {
    request.post({
        url: req_response_url,
        body: response_body_preview,
        json: true,
    }, function (error, response, body) {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            // Insert a callback?
            console.log(`Body: ${body}, Response ${response}`);
        }
    })
}

exports.data = methods;
