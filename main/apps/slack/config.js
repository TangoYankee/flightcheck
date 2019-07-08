var config = {};

const process = require('process');

config.slack = {};
config.slack.client_id = process.env.SLACK_CLIENT_ID;
config.slack.client_secret = process.env.SLACK_CLIENT_SECRET;

module.exports = config;
