var request = require("request");

methods.formatLink = (user_input, res) => {
    var user_input_split = user_input.split(' ');
    if (user_input_split.length <= 3 && user_input_split.length >= 1){
        if (user_input_split[0] == "help") {
            res.json({
                "response_type":"in_channel",
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
        } else {
            let message;
            if (user_input_split[2]){
                message = user_input_split[2];
            } else {
                message = "";
            }
            res.json({
                "response_type":"in_channel",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type" : "mrkdwn",
                            "text": `${message} <${user_input_split[0]} | ${user_input_split[1]}>`
                        }
                    }
                ]
            })
        }
    } else {
        res.json({
            "response_type":"in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "please enter an option"
                    }
                }
            ]
        })
    }
}

exports.data = methods;
