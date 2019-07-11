messages = {};
// Decompose into a message constructor, eventually


messages.help = (feedback) => {
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

messages.preview = (markdown_message) => {
    // First message is emphemeral and interactive, acting only as a preview
    // Provides a preview of the link formatting with the message
    // Provides two options: 
    // Save message- triggers the final message, which is 'in_channel' and contains only formatted text
    // Discard message- triggers ephemeral message that simply deletes the initial message
    return {
        "response_type": "in_channel",
        "blocks": [
            {
                "type": "context",
                "elements": [
                    {
                        "type": "plain_text",
                        "text": "message preview"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${markdown_message}`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "publish :heavy_check_mark:",
                            "emoji": true
                        },
                        "value": "publish"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "discard :negative_squared_cross_mark:",
                            "emoji": true
                        },
                        "value": "discard"
                    }
                ]
            }
        ]
    }
}

messages.publish = (markdown_message, user_id) => {
    return {
        "response_type": "in_channel",
        "replace_original": "true",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": markdown_message
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
                        "text": `posted by <@${user_id}>`
                    }
                ]
            }
        ]
    }
}

messages.discard = () => {
    // delete the initial message
    return {
        "response_type": "ephemeral",
        "delete_original": "true",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "this message will self-destruct when your workspace refreshes"
                }
            }
        ]
    }
}

exports.data = messages;
