var request = require('request');

var methods = {};

methods.formatLink = (user_input, response_url, res) => {
    var user_input_split = user_input.split(' ');
    var user_input_split_len = user_input_split.length;
    var response_body;
    // Test that there is only one user input and that it is 'help'
    if (user_input_split_len == 1 && user_input_split[0] == "help") {
        res.send()
        response_body = {
            "response_type": "in_channel",
            "replace_original": "true",
            "delete_original": "true",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "help message"
                    }
                }
            ]
        }
        request.post({
            url: response_url,
            body: response_body,
            json: true,
        }, function (error, response, body) {
            if (error) {
                console.log(`Error: ${error}`);
            } else {
                console.log(`Body: ${body}, Response ${response}`);
            }
        })
        // Test that there are exactly two user inputs
    } else if (user_input_split_len == 2) {
        var original_url = user_input_split[0];
        var split_url;
        var new_url;
        // Test that it contains "|" indicating it's been recognized as a hyperlink
        if (original_url.indexOf("|")) {
            // Format the hyperlink and return it as a message
            split_url = original_url.split("|");
            new_url = `${split_url[0]}|${user_input_split[1]}>`;
            res.send()
            response_body = {
                "response_type": "in_channel",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": new_url
                        }
                    }
                ]
            }
            request.post({
                url: response_url,
                body: response_body,
                json: true,
            }, function (error, response, body) {
                if (error) {
                    console.log(`Error: ${error}`);
                } else {
                    console.log(`Body: ${body}, Response: ${response}`);
                }
            })
        } else {
            res.json({
                "response_type": "ephemeral",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `:warning:${original_url} is not a recognized url. Help Message`
                        }
                    }
                ]
            })
        }
    } else {
        res.json({
            "response_type": "emphemeral",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "did not recognize that option. help message"
                    }
                }
            ]
        })
    }
}

exports.data = methods;
