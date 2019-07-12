var request = require('request');
var messages = require('./messages.js');
var format = require('./format.js');
var methods = {};

methods.markdown = (request_body, response) => {
    var text = request_body.text;
    var response_url = request_body.response_url;
    var user_id = request_body.user_id;
    if (text.trim() == "help") {
        response.json(messages.data.help(`welcome to markdownlinks, <@${user_id}>!`))
    } else if (text) {
        response.send()
        markdown_format = format.data.formatLinks(text);
        markdown_message = messages.data.markdown(markdown_format);
        methods.sendMarkdown(markdown_message, response_url);
    } else {
        response.json(messages.data.help("please provide input"))
    }
}

methods.sendMarkdown = (response_body_preview, response_url) => {
    request.post({
        url: response_url,
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

methods.delete = (response_payload, response) => {
    response.send();
    var response_url = response_payload.response_url;
    var value = response_payload.actions[0].value;
    var response_message;
    if (value == "delete"){
        response_message = messages.data.delete();
    } else {
        response_message = messages.data.error();
    }
    methods.sendDelete(response_url, response_message)
}

methods.sendDelete = (response_url, response_message) => {
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
