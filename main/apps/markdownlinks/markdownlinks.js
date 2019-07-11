var request = require('request');
var messages = require('./messages.js');
var format = require('./format.js');
var methods = {};

methods.simpleLinks = (request_body, response) => {
    var request_text = request_body.text;
    var request_response_url = request_body.response_url;
    var request_user_id = request_body.user_id;
    if (request_text.trim() == "help") {
        response.json(messages.data.help(`Welcome to Simple Links, <@${request_user_id}>!`))
    } else if (request_text) {
        response.send()
        format_body = format.data.formatLinks(request_text);
        response_body_preview = messages.data.preview(format_body);
        methods.sendPreview(response_body_preview, request_response_url);
    } else {
        response.json(messages.data.help("please provide input"))
    }
}

methods.sendPreview = (response_body_preview, request_response_url) => {
    request.post({
        url: request_response_url,
        body: response_body_preview,
        json: true,
    }, function (error, response, body) {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            console.log(`Body: ${body}, Response ${response}`);
        }
    })
}

methods.composeFinalMessage = (response_payload, response) => {
    response.send();
    var response_url = response_payload.response_url;
    var message = response_payload.message.blocks[1].text.text;
    var value = response_payload.actions[0].value;
    var user_id = response_payload.user.id;
    var response_message;
    if (value == "publish"){
        response_message = messages.data.publish(message, user_id);
    } else if (value == "discard"){
        response_message = messages.data.discard();
    }
    methods.sendFinalMessage(response_url, response_message)
}

methods.sendFinalMessage = (response_url, response_message) => {
    request.post({
        url: response_url,
        body: response_message,
        json: true,
    },function (error, response, body) {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            // Insert a callback?
            console.log(`Body: ${body}, Response ${response}`);
        }
    })
}

exports.data = methods;
