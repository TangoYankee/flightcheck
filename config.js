var config = {};

const process = require('process');

config.slack = {};
config.slack.client_id = process.env.SLACK_CLIENT_ID;
config.slack.client_secret = process.env.SLACK_CLIENT_SECRET;

config.mapquest = {};
config.mapquest.maps_key = process.env.MAPQUEST_MAPS_KEY;

config.flightstats = {};
config.flightstats.key = process.env.FLIGHTSTATS_KEY;
config.flightstats.app_id = process.env.FLIGHTSTATS_APP_ID;

config.port = 4390;

module.exports = config;
