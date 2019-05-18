var config = {};

config.slack = {};
config.mapquest = {};
config.flightstats = {};

// TODO: process.env for usernames and keys
config.slack.client_id = process.env.SLACK_CLIENT_ID;
config.slack.client_secret = '';
config.slack.url = "";// No need to hide this url

config.mapquest.maps_key = "";

config.flightstats.key = "";
config.flightstats.app_id = "";

config.port = 4390;

module.exports = config;