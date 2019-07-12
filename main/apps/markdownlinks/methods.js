var request = require('request');
var messages = require('./messages.js');
var format = require('./format.js');
var methods = {};

// TODO: refactor program for case-insensitivity

methods.publish = (request_body, response) => {
    var text = request_body.text;
    var response_url = request_body.response_url;
    var user_id = request_body.user_id;
    if (text.trim() == "help") {
        response.json(messages.data.helpMessage(`welcome to markdownlinks, <@${user_id}>!`));
    } else if (text) {
        response.send()
        formatted_text = format(text);
        markdown_message = messages.data.markdownMessage(formatted_text);
        methods.postMessage(response_url, markdown_message);
    } else {
        response.json(messages.data.helpMessage(":warning:please provide input"))
    }
}


methods.delete = (response_payload, response) => {
    response.send();
    var response_url = response_payload.response_url;
    var value = response_payload.actions[0].value;
    var response_message;
    if (value == "delete"){
        response_message = messages.data.deleteMessage();
    } else {
        response_message = messages.data.errorMessage();
    }
    methods.postMessage(response_url, response_message)
}


methods.postMessage = (response_url, response_message) => {
    request.post({
        url: response_url,
        body: response_message,
        json: true,
    },function (error, response, body) {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            console.log(`Body: ${body}, Response ${response}`);
        }
    })
}


exports.data = methods;
