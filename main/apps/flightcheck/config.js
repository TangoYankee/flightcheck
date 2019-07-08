var config = {};
const process = require('process');

config.flightstats = {};
config.flightstats.key = process.env.FLIGHTSTATS_KEY;
config.flightstats.app_id = process.env.FLIGHTSTATS_APP_ID;

config.mapquest = {};
config.mapquest.maps_key = process.env.MAPQUEST_MAPS_KEY;

module.exports = config;
