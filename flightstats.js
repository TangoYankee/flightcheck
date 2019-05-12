var config = require('./config.js')

// Calls
// Status of Flight number by departure
// Track of Flight number by departure
// Delay index by Airport

flightstats_key = config.flightstats.key;
flightstats_app_id = config.flightstats.app_id;
// uri = "https://api.flightstats.com/flex/flightstatus/{protocol}/v2/json/flight/status/{carrier}/{flight}/arr/{year}/{month}/{day}"

var today = new Date();
var call_sign = "UAL 1234"
var carrier = call_sign.match(/[a-zA-Z]+/)[0];
var flight = call_sign.match(/\d+/)[0];

uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`
method = 'GET'

console.log(uri)