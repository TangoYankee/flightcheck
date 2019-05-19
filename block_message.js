var formatter = require('./format.js')
var config = require('./config.js')

var methods = {}

methods.setTrackMessage = (flight_track) => {
    if (flight_track.flightTracks.length != 0) {
        // Check for the existance of values
        if (flight_track.flightTracks[0].departureDate) {
            var departureDate = [formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateLocal), formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateUtc)];
        } else {
            var departureDate = ["unknown", "unknown"]
        }
        if (flight_track.flightTracks[0].positions && flight_track.flightTracks[0].positions.length != 0) {
            var positions = [formatter.data.formatDateTime(flight_track.flightTracks[0].positions[0].date), flight_track.flightTracks[0].positions[0].lat, flight_track.flightTracks[0].positions[0].lon]
        } else {
            var positions = ["unknown", 0, 0]
        }
        if (flight_track.request && flight_track.request.airline && flight_track.request.flight) {
            var requestedFlight = `${flight_track.request.airline.requestedCode}${flight_track.request.flight.requested}`
        } else {
            var requestedFlight = "unknown"
        }
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Call Sign:* ${flight_track.flightTracks[0].callsign}\n*Departed at:* 
                        ${departureDate[0]} 
                        (Local), ${departureDate[1]}
                        (UTC)\n*Postion at:* ${positions[0]} 
                        (UTC)\n*Traveling* from ${flight_track.flightTracks[0].departureAirportFsCode} to
                        ${flight_track.flightTracks[0].arrivalAirportFsCode}`
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
        return methods.setHelpMessage(`Cannot find a position for ${requestedFlight}. It may not be airborne`);
    }
}

methods.setStatusMessage = (flight_status) => {
    // TODO: Check each field that must be sent through a function
    if (flight_status.flightStatuses.length != 0) {
        var flt_status = flight_status.flightStatuses[0];
        var airports = flight_status.appendix.airports;
        if (flight_status.appendix.equipments && flight_status.appendix.equipments.length != 0) {
            var aircraftType = flight_status.appendix.equipments[0].name;
        } else {
            var aircraftType = "unknown";
        }

        if (airports && airports.length >= 2) {
            var dep_port = airports[0];
            var arr_port = airports[1];
        } else {
            // User will see "undefined", rather than value of string
            var dep_port = "";
            var arr_port = "";
        }

        // formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal)
        // formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc)
        // formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal) 
        // formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc)
        // formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal)
        // formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc)
        // formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal)
        // formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc)
        // formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes)
        // flt_status.airportResources.departureTerminal
        // flt_status.airportResources.departureGate
        // flt_status.airportResources.arrivalTerminal

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
                        // TODO: Errors from these fields missing are unhandled
                        "text": `*Flight Time:* ${formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes)}
                        \n*Gate Departure:*\nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal)}_ 
                        (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc)}_ 
                        (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal)}_ 
                        (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc)}_ 
                        (UTC)\nTerminal _${flt_status.airportResources.departureTerminal}_, 
                        Gate _${flt_status.airportResources.departureGate}_\n*Gate Arrival*
                        \nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal)}_ 
                        (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc)}_ 
                        (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal)}_ 
                        (Local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc)}_ 
                        (UTC)\nTerminal _${flt_status.airportResources.arrivalTerminal}_`
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
        if (delayed_airport.delayIndexes[0].airport) {
            var airport = `${delayed_airport.delayIndexes[0].airport.name} (${delayed_airport.delayIndexes[0].airport.icao})`;
        } else {
            var airport = "unknown";
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
