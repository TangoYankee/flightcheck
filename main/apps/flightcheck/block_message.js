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
        var dep_port;
        var arr_port;
        if (airports && airports.length >= 2) {
            dep_port = airports[0];
            arr_port = airports[1];
        } else {
            dep_port = "unknown";
            arr_port = "unknown";
        }
        var sched_dep_local, est_dep_local, sched_arr_local, est_arr_local;
        var sched_dep_utc, est_dep_utc, sched_arr_utc, est_arr_utc;
        if (flt_status.operationalTimes) {
            if (flt_status.operationalTimes.scheduledGateDeparture) {
                sched_dep_local = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal);
                sched_dep_utc = flt_status.operationalTimes.scheduledGateDeparture.dateUtc;
            } else {
                sched_dep_local = "unknown"
            }
            if (flt_status.operationalTimes.estimatedGateDeparture) {
                est_dep_local = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal);
                est_dep_utc = flt_status.operationalTimes.estimatedGateDeparture.dateUtc;
            } else {
                est_dep_local = "unknown"
            } 
            if (flt_status.operationalTimes.scheduledGateArrival) {
                sched_arr_local = formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal);
                sched_arr_utc = flt_status.operationalTimes.scheduledGateArrival.dateUtc;
            } else {
                sched_arr_local = "unknown"
            } 
            if (flt_status.operationalTimes.estimatedGateArrival) {
                est_arr_local = formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal);
                est_arr_utc = flt_status.operationalTimes.estimatedGateArrival.dateUtc;
            } else {
                est_arr_local = "unknown"
            }
        } else {
            sched_dep_local = "unknown";
            est_dep_local = "unknown";
            sched_arr_local = "unknown";
            est_arr_local = "unknown";
        }
        var display_dep_time = formatter.data.formatDisplayTime(est_dep_local, sched_dep_local);
        var display_arr_time = formatter.data.formatDisplayTime(est_arr_local, sched_arr_local);
        var dep_time_change_msg = formatter.data.formatChangeSchedTime(est_dep_utc, sched_dep_utc);
        var arr_time_change_msg = formatter.data.formatChangeSchedTime(est_arr_utc, sched_arr_utc);

        var sched_block_minutes;
        if (flt_status.flightDurations) {
            sched_block_minutes = formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes);
        } else {
            sched_block_minutes = "unknown";
        }
        var dep_terminal, dep_gate, arr_terminal, arr_gate;
        if (flt_status.airportResources) {
            dep_terminal = flt_status.airportResources.departureTerminal;
            dep_gate = flt_status.airportResources.departureGate;
            arr_terminal = flt_status.airportResources.arrivalTerminal;
            arr_gate = flt_status.airportResources.arrivalGate;
        } else {
            dep_terminal = "unknown";
            dep_gate = "unknown";
            arr_terminal = "unknown";
            arr_gate = "unknown";
        }
        return {
            "response_type": "ephemeral",
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": `*Call sign:* ${flt_status.carrierFsCode}${flt_status.flightNumber}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": `*Flight time:* ${sched_block_minutes}`
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
                            "text": `*Departing:* ${dep_port.icao} :airplane_departure: \n ${display_dep_time} - ${dep_time_change_msg} \n Gate: ${dep_gate}, Terminal: ${dep_terminal}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": `*Arriving:* ${arr_port.icao} :airplane_arriving: \n ${display_arr_time} - ${arr_time_change_msg} \n Gate: ${arr_gate}, Terminal: ${arr_terminal}`
                        }
                    ]
                }
            ]
        }
    } else {
        return methods.setHelpMessage(":warning:cannot find a status for that aircraft");
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
        "response_type": "emphemeral",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*flightcheck* provides status information on flights and airports, tailored to serve travelers and those looking after them. Please use the following command options to improve your next trip."
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*status 'flight number':*\n information on flight gates and delays \n _ex)_ `/flightcheck status aa2853`"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*status 'airport identifier':* \n information on airport delays \n _ex)_ `/flightcheck status ksfo`"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*position 'flight number':* \n map of the last reported flight location \n _ex)_ `/flightcheck position aa2853`"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*help* \n return to this menu \n _ex)_ `/flightcheck help`"
                    }
                ]
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "Visit the <http://flightcheck.us-east-2.elasticbeanstalk.com/ | Flightcheck homepage>"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Provide feedback on <https://github.com/tangoyankee/slack-flightcheck | GitHub>"
                    }
                ]
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
            "fallback": `View your flights at openstreetmap`,
            "actions": [
                {
                    "type": "button",
                    "text": "View full map",
                    "url": `https://www.openstreetmap.org/`
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
