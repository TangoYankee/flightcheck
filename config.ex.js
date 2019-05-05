var config = {};

config.flight_aware = {};
config.slack = {};

// TODO: process.env for usernames and keys
config.flight_aware.user = "";
config.flight_aware.key = "";
config.flight_aware.url = "";

config.slack.client_id = "";
config.slack.client_secret = "";
config.slack.url = "";

config.port = 4390;

module.exports = config;
