messages = {};


messages.helpMessage = (feedback) => {
    return {
        "response_type": "ephemeral",
        "blocks": [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${feedback}`
            }
        }, {
            "type": "context",
            "elements": [
                {
                    "type": "plain_text",
                    "text": "Use /markdownlinks to format your links like so: "
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*User Input*\n `/markdownlinks make [markdown](https://www.markdownguide.org/) links with [us](http://markdownlinks.io)`"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Returned message*\n make <https://www.markdownguide.org/|markdown> links with <http://markdownlinks.io|us>"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "visit markdownlinks.io"
                },
                {
                    "type": "mrkdwn",
                    "text": "support <https://www.codeforamerica.org/donate|code for america>"
                }
            ]
        }
        ]
    }
}


messages.markdownMessage = (markdown_format, user_id) => {
    return {
        "response_type": "in_channel",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${markdown_format}`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `shared by <@${user_id}>`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "delete message :negative_squared_cross_mark:",
                        "emoji": true
                    },
                    "value": "delete"
                }
            }
        ]
    }
}


messages.deleteMessage = () => {
    return {
        "response_type": "ephemeral",
        "delete_original": "true",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":warning:this message will self-destruct when your workspace refreshes"
                }
            }
        ]
    }
}


messages.errorMessage = () => {
    // delete the initial message
    return {
        "response_type": "ephemeral",
        "delete_original": "false",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":warning:command not recongized"
                }
            }
        ]
    }
}


exports.data = messages;
