var formatter = require('./format.js')
var config = require('./config.js')

var methods = {}

methods.setTrackMessage = (flight_track) => {
    if (flight_track.flightTracks.length != 0) {
        // Check for the existance of values
        var departureDate;
        var positions;
        if (flight_track.flightTracks[0].departureDate) {
            departureDate = [formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateLocal), formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateUtc)];
        } else {
            departureDate = ["unknown", "unknown"]
        }
        if (flight_track.flightTracks[0].positions && flight_track.flightTracks[0].positions.length != 0) {
            positions = [formatter.data.formatDateTime(flight_track.flightTracks[0].positions[0].date), flight_track.flightTracks[0].positions[0].lat, flight_track.flightTracks[0].positions[0].lon]
        } else {
            positions = ["unknown", 0, 0]
        }
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Call Sign:* ${flight_track.flightTracks[0].callsign}\n*Departed at:* ${departureDate[0]} (Local), ${departureDate[1]} (UTC)\n*Postion at:* ${positions[0]} (UTC)\n*Traveling:* from ${flight_track.flightTracks[0].departureAirportFsCode} to ${flight_track.flightTracks[0].arrivalAirportFsCode}`
                    }
                },
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        "text": `${flight_track.flightTracks[0].callsign} map preview`,
                        "emoji": true
                    },
                    "image_url": `https://open.mapquestapi.com/staticmap/v5/map?locations=${positions[1]},${positions[2]}&size=@2x&zoom=8&key=${config.mapquest.maps_key}`,
                    "alt_text": "map of aircraft"
                }
            ],
            "attachments": [
                {
                    "fallback": `View your flights at https://www.openstreetmap.org/?mlat=${positions[1]}&mlon=${positions[2]}&zoom=9#map=9/${positions[1]}/${positions[2]}`,
                    "actions": [
                        {
                            "type": "button",
                            "text": "View full map",
                            "url": `https://www.openstreetmap.org/?mlat=${positions[1]}&mlon=${positions[2]}&zoom=9#map=9/${positions[1]}/${positions[2]}`
                        }
                    ]
                }
            ]
        }
    } else {
        var requestedFlight;
        if (flight_track.request && flight_track.request.airline && flight_track.request.flight) {
            requestedFlight = `${flight_track.request.airline.requestedCode}${flight_track.request.flight.requested}`
        } else {
            requestedFlight = "unknown"
        }
        return methods.setHelpMessage(`Cannot find a position for ${requestedFlight}. It may not be airborne`);
    }
}

methods.setStatusMessage = (flight_status) => {
    if (flight_status.flightStatuses.length != 0) {
        var flt_status = flight_status.flightStatuses[0];
        var airports = flight_status.appendix.airports;
        var aircraftType;
        if (flight_status.appendix.equipments && flight_status.appendix.equipments.length != 0) {
            aircraftType = flight_status.appendix.equipments[0].name;
        } else {
            aircraftType = "unknown";
        }
        var dep_port;
        var arr_port;
        if (airports && airports.length >= 2) {
            dep_port = airports[0];
            arr_port = airports[1];
        } else {
            dep_port = "unknown";
            arr_port = "unknown";
        }
        var sched_dep_local;
        var sched_dep_utc;
        var est_dep_local;
        var est_dep_utc;
        var sched_arr_local;
        var sched_arr_utc;
        var est_arr_local;
        var est_arr_utc;
        if (flt_status.operationalTimes) {
            if (flt_status.operationalTimes.scheduledGateDeparture) {
                sched_dep_local = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal);
                sched_dep_utc = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc);
            } else {
                sched_dep_local = "unknown";
                sched_dep_utc = "unknown";
            }
            if (flt_status.operationalTimes.estimatedGateDeparture) {
                est_dep_local = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal);
                est_dep_utc = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc);
            } else {
                est_dep_local = "unknown";
                est_dep_utc = "unknown";
            }
            if (flt_status.operationalTimes.scheduledGateArrival) {
                sched_arr_local = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal);
                sched_arr_utc = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc);
            } else {
                sched_arr_local = "unknown";
                sched_arr_utc = "unknown";

            }
            if (flt_status.operationalTimes.estimatedGateArrival) {
                est_arr_local = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal);
                est_arr_utc = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc);
            } else {
                est_arr_local = "unknown";
                est_arr_utc = "unknown";
            }
        } else {
            sched_dep_local = "unknown";
            sched_dep_utc = "unknown";
            est_dep_local = "unknown";
            est_dep_utc = "unknown";
            sched_arr_local = "unknown";
            sched_arr_utc = "unknown";
            est_arr_local = "unknown";
            est_arr_utc = "unknown";
        }
        var scheduledBlockMinutes;
        if (flt_status.flightDurations) {
            scheduledBlockMinutes = formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes);
        } else {
            scheduledBlockMinutes = "unknown";
        }
        var departureTerminal;
        var departureGate;
        var arrivalTerminal;
        var arrivalGate;
        if (flt_status.airportResources) {
            departureTerminal = flt_status.airportResources.departureTerminal;
            departureGate = flt_status.airportResources.departureGate;
            arrivalTerminal = flt_status.airportResources.arrivalTerminal;
            arrivalGate = flt_status.airportResources.arrivalGate;
        } else {
            departureTerminal = "unknown";
            departureGate = "unknown";
            arrivalTerminal = "unknown";
            arrivalGate = "unknown";
        }
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Call Sign:* ${flt_status.carrierFsCode}${flt_status.flightNumber}\n*Type Aircraft:* ${aircraftType}`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Departing:*\n${dep_port.name} (${dep_port.icao});\n${dep_port.city}, ${dep_port.stateCode} ${dep_port.countryName}\n_Local time ${formatter.data.formatDateTime(dep_port.localTime)}_\n*Arriving:*\n${arr_port.name} (${arr_port.icao})\n${arr_port.city}, ${arr_port.stateCode} ${arr_port.countryName}\n_Local time ${formatter.data.formatDateTime(arr_port.localTime)}_`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Flight Time:* ${scheduledBlockMinutes}\n*Gate Departure:*\nScheduled _${sched_dep_local}_ (local) _${sched_dep_utc}_ (UTC)\nEstimated _${est_dep_local}_ (local) _${est_dep_utc}_ (UTC)\nTerminal _${departureTerminal}_, Gate _${departureGate}_\n*Gate Arrival*\nScheduled _${sched_arr_local}_ (local) _${sched_arr_utc}_ (UTC)\nEstimated _${est_arr_local}_ (Local) _${est_arr_utc}_ (UTC)\nTerminal _${arrivalTerminal}_ Gate _${arrivalGate}_`
                    }
                }
            ]
        }
    } else {
        return methods.setHelpMessage("Cannot find a status for that aircraft.");
    }
}

methods.setDelayMessage = (delayed_airport) => {
    if (delayed_airport.delayIndexes != 0) {
        var airport;
        if (delayed_airport.delayIndexes[0].airport) {
            airport = `${delayed_airport.delayIndexes[0].airport.name} (${delayed_airport.delayIndexes[0].airport.icao})`;
        } else {
            airport = "unknown";
        }

        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*${airport}*\n*Delay Index* ${delayed_airport.delayIndexes[0].normalizedScore}/5\n*Change in Delays* ${delayed_airport.delayIndexes[0].delta} % (Positive numbers mean worse delays)\n*Observed Aircraft* ${delayed_airport.delayIndexes[0].observations}\n`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "plain_text",
                            "text": `On Time: ${delayed_airport.delayIndexes[0].onTime}`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": `15 min delay: ${delayed_airport.delayIndexes[0].delayed15}`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": `30 min delay: ${delayed_airport.delayIndexes[0].delayed30}`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": `45 min delay: ${delayed_airport.delayIndexes[0].delayed45}`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": `Canceled: ${delayed_airport.delayIndexes[0].canceled}`,
                            "emoji": true
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": `*Observed* ${formatter.data.formatDateTime(delayed_airport.delayIndexes[0].dateStart)} to ${formatter.data.formatDateTime(delayed_airport.delayIndexes[0].dateEnd)} (UTC)`
                        }
                    ]
                }
            ]
        }
    } else {
        return methods.setHelpMessage("Cannot find a status for that airport");
    }
}

methods.setHelpMessage = (message) => {
    return {
        "response_type": "in_channel",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${message}`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "try these options:\n-`status [flight-number]` for flight details\n-`status [airport-identifier]` for airport delays\n-`position [flight-number]` to see where the flight is \n-`help`, for this menu"
                }
            }
        ]
    }
}

exports.data = methods;

// Flight Position Simple
var flightPositionSimple = {
    "request_type": "ephemeral",
    "blocks": [
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Call sign:* AA2853"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Traveling:* KSFO - KSMF"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Departure time: * 1000 July 01 (UTC)"
                },
                            {
                    "type": "mrkdwn",
                    "text": "*Time of request: * 1230 July 01 (UTC)"
                }
            ]
        },
        {
            "type": "image",
            "title": {
                "type": "plain_text",
                "text": "AA2853 position",
                "emoji": true
            },
            "image_url": "https://open.mapquestapi.com/staticmap/v5/map?locations=33.1978,-86.8236&size=@2x&zoom=8&key=RNIhBjnrevcx8yjIyYS3AsJwORR7Azgr",
            "alt_text": "map of aircraft"
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "Last updated: 1130 July 01 (UTC)"
                }
            ]
        }
    ],
    "attachments": [
        {
            "fallback": `View your flights at https://www.openstreetmap.org/?mlat=${positions[1]}&mlon=${positions[2]}&zoom=9#map=9/${positions[1]}/${positions[2]}`,
            "actions": [
                {
                    "type": "button",
                    "text": "View full map",
                    "url": `https://www.openstreetmap.org/?mlat=${positions[1]}&mlon=${positions[2]}&zoom=9#map=9/${positions[1]}/${positions[2]}`
                }
            ]
        }
    ]
}

// Flight Status Simple
var flightStatusSimple = {
    "channel": `${channel_id}`,
    "response_type": "ephemeral",
    "blocks": [
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Call sign:* AA2853"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Flight time* 3 hr 58 min"
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Departing:* KORD :airplane_departure: \n 1052, July 06 - 10 min late :red_circle: \n Gate: 4, Terminal: 1"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Arriving:* KJAC :airplane_arriving: \n 1752, July 06 - 8 min early :black_circle: \n Gate: 32, Terminal: C"
                }
            ]
        }
    ]
}

// Airport Status Simple
var airportStatusSimple = {
    "response_type":"emphemeral",
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*San Francisco International (KSFO)* \n San Francisco, CA United States \n Local time at airport - 11:30 am, July 06"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Aircraft on schedule:* 25/81"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Delay index*: 4/5:warning: - 10% better :thumbsup:"
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "*Observed:* 1700 July 06 - 1800 July 06 (UTC)"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Time of request:* 1830 July 06 (UTC)"
                }
            ]
        }
    ]
}
