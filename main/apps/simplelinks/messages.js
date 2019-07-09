messages = {};
// Decompose into a message constructor, eventually


messages.help = (feedback) => {
    return {
        "response_type": "ephemeral",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${feedback} help message`
                }
            }
        ]
    }
}

messages.preview = (formatted_message) => {
    // First message is emphemeral and interactive, acting only as a preview
    // Provides a preview of the link formatting with the message
    // Provides two options: 
    // Save message- triggers the final message, which is 'in_channel' and contains only formatted text
    // Discard message- triggers ephemeral message that simply deletes the initial message
    return {
        "response_type": "ephemeral",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": formatted_message
                }
            }
        ]
    }
}

messages.final = (formatted_message) => {
    return {
        "response_type": "in_channel",
        "delete_original": "true",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": formatted_message
                }
            }
        ]
    }
}

messages.discard = () => {
    // simply delete the initial message
    return {
        "response_type": "ephemeral",
        "delete_original": "true"
    }
}

messages.loading = () => {
    return {
        "response_type": "ephemeral",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "loading"
                }
            }
        ]
    }
}

exports.data = messages;