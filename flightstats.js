var config = require('./config.js')
var request = require('request');
// Test data
var sample = require('./sample.json')

var str = "2019-05-13T22:14:24.661"
formatDateTime = (raw_date_time) => {
    var date_time = raw_date_time.split('T');
    var split_date = date_time[0].split('-');
    var split_time = date_time[1].split(':');
    var hour = split_time[0];
    var minute = split_time[1];
    var day = split_date[2];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var month = months[split_date[1].replace(/0/g, '')-1];
    return (`${hour}:${minute}, ${day} ${month}`);
}

formatFlightTime = (block_time) => {
    var block_hours = Math.trunc(block_time / 60)
    var block_minutes = block_time % 60
    return (`${block_hours}hr ${block_minutes}min (${block_time} minutes)`);
}

// Calls
// Status of Flight number by departure
// Track of Flight number by departure
// Delay index by Airport

flightstats_key = config.flightstats.key;
flightstats_app_id = config.flightstats.app_id;
// uri = "https://api.flightstats.com/flex/flightstatus/{protocol}/v2/json/flight/status/{carrier}/{flight}/arr/{year}/{month}/{day}"

// var today = new Date();
// var call_sign = "AA 100"
// var carrier = call_sign.match(/[a-zA-Z]+/)[0];
// var flight = call_sign.match(/\d+/)[0];

// Use UTC time to ease concerns about where the source of the "local time" is
// Offset month by one, as Node's Month in Date starts at 0?!
// uri = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/dep/${today.getUTCFullYear()}/${today.getUTCMonth()+1}/${today.getUTCDate()}`
// method = 'GET'

// request({
//     url: uri,
//     qs: {appId: config.flightstats.app_id, appKey: config.flightstats.key, utc: "true"},
//     method: 'GET',

// }, function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })

var flt_status = sample.flightStatuses[0];
var airports = sample.appendix.airports;
console.log(`Call Sign: ${flt_status.carrierFsCode}${flt_status.flightNumber}`);
console.log(`Type Aircraft: ${sample.appendix.equipments[0].name}`);
console.log(`Departure Airport: ${airports[0].name} (${airports[0].icao}); ${airports[0].city}, ${airports[0].stateCode} ${airports[0].countryName} ${formatDateTime(airports[0].localTime)} (Local)`);
console.log(`Arrival Airport: ${airports[1].name} (${airports[1].icao}); ${airports[1].city}, ${airports[1].stateCode} ${airports[1].countryName} ${formatDateTime(airports[1].localTime)} (Local)`);

// Toggle Between local and zulu times?
console.log(`
Flight Time: ${formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes)}
Scheduled Gate Departure: ${formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal)} (Local) ${formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc)} (UTC)
Estimated Gate Departure: ${formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal)} (Local) ${formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc)} (UTC)
Departure Terminal ${flt_status.airportResources.departureTerminal}, Gate ${flt_status.airportResources.departureGate}
Scheduled Gate Arrival: ${formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal)} (Local) ${formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc)} (UTC)
Estimated Gate Arrival: ${formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal)} (Local) ${formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc)} (UTC)
Arrival Terminal ${flt_status.airportResources.arrivalTerminal}
`);
