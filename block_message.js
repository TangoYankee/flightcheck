var formatter = require('./format.js')
var config = require('./config.js')

var methods = {}

methods.setTrackMessage = (flight_track) => {
    if (flight_track.flightTracks.length != 0) {
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        // TODO: Handle errors
                        "text": `*Call Sign:* ${flight_track.flightTracks[0].callsign}\n*Departed at:* ${formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateLocal)} (Local), ${formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateUtc)} (UTC)\n*Postion at:* ${formatter.data.formatDateTime(flight_track.flightTracks[0].positions[0].date)} (UTC)\n*Traveling* from ${flight_track.flightTracks[0].departureAirportFsCode} to ${flight_track.flightTracks[0].arrivalAirportFsCode}`
                    }
                },
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        // Error handled by "if" filter
                        "text": `${flight_track.flightTracks[0].callsign} map preview`,
                        "emoji": true
                    },
                    // TODO: handle position errors
                    "image_url": `https://open.mapquestapi.com/staticmap/v5/map?locations=${flight_track.flightTracks[0].positions[0].lat},${flight_track.flightTracks[0].positions[0].lon}&size=@2x&zoom=8&key=${config.mapquest.maps_key}`,
                    "alt_text": "map of aircraft"
                }
            ],
            "attachments": [
                {
                    // TODO: handle position errors
                    "fallback": `View your flights at https://www.openstreetmap.org/?mlat=${flight_track.flightTracks[0].positions[0].lat}&mlon=${flight_track.flightTracks[0].positions[0].lon}&zoom=9#map=9/${flight_track.flightTracks[0].positions[0].lat}/${flight_track.flightTracks[0].positions[0].lon}`,
                    "actions": [
                        {
                            "type": "button",
                            "text": "View full map",
                            // TODO: handle position errors
                            "url": `https://www.openstreetmap.org/?mlat=${flight_track.flightTracks[0].positions[0].lat}&mlon=${flight_track.flightTracks[0].positions[0].lon}&zoom=9#map=9/${flight_track.flightTracks[0].positions[0].lat}/${flight_track.flightTracks[0].positions[0].lon}`
                        }
                    ]
                }
            ]
        }
    } else {
        return methods.setHelpMessage(`Cannot find a position for ${flight_track.request.airline.requestedCode}${flight_track.request.flight.requested}. It may not be airborne`);
    }
}

methods.setStatusMessage = (flight_status) => {
    // TODO: Check each field that must be sent through a function
    if (flight_status.flightStatuses.length != 0) {
        var flt_status = flight_status.flightStatuses[0];
        var airports = flight_status.appendix.airports;
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        //TODO: Error for missing equipment field is unhandled
                        "text": `*Call Sign:* ${flt_status.carrierFsCode}${flt_status.flightNumber}\n*Type Aircraft:* ${flight_status.appendix.equipments[0].name}`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        //Node will handle one call on a string before it throws an error
                        "text": `*Departing:*\n${airports[0].name} (${airports[0].icao});\n${airports[0].city}, ${airports[0].stateCode} ${airports[0].countryName}\n_Local time ${formatter.data.formatDateTime(airports[0].localTime)}_\n*Arriving:*\n${airports[1].name} (${airports[1].icao})\n${airports[1].city}, ${airports[1].stateCode} ${airports[1].countryName}\n_Local time ${formatter.data.formatDateTime(airports[1].localTime)}_`
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
                        "text": `*Flight Time:* ${formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes)}\n*Gate Departure:*\nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc)}_ (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc)}_ (UTC)\nTerminal _${flt_status.airportResources.departureTerminal}_, Gate _${flt_status.airportResources.departureGate}_\n*Gate Arrival*\nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc)}_ (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal)}_ (Local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc)}_ (UTC)\nTerminal _${flt_status.airportResources.arrivalTerminal}_`
                    }
                }
            ]
        }
    } else {
        return methods.setHelpMessage("Cannot find a status for that aircraft.");
    }
}

methods.setDelayMessage = (delayed_airport) => {
    // "if" filter should handle any errors that would come from an undefined field
    if (delayed_airport.delayIndexes != 0) {
        return {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*${delayed_airport.delayIndexes[0].airport.name} (${delayed_airport.delayIndexes[0].airport.icao})*\n*Delay Index* ${delayed_airport.delayIndexes[0].normalizedScore}/5\n*Change in Delays* ${delayed_airport.delayIndexes[0].delta} % (Positive numbers mean worse delays)\n*Observed Aircraft* ${delayed_airport.delayIndexes[0].observations}\n`
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
