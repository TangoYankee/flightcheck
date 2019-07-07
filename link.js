var request = require("request");

var methods = {};

methods.formatLink = (user_input, res) => {
    var user_input_split = user_input.split(' ');
    var user_input_split_len = user_input_split.length;
    // Test that there is only one user input and that it is 'help'
    if (user_input_split_len == 1 && user_input_split[0] == "help") {
        res.json({
            "response_type": "ephemeral",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "help message"
                    }
                }
            ]
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
            res.json({
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
