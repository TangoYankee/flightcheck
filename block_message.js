var formatter = require('./format.js')
var config = require('./config.js')

var methods = {}

methods.setTrackMessage = (flight_track) => {
    if (flight_track.flightTracks.length != 0) {
        var message = {
            "response_type": "in_channel",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `
                        *Call Sign:* ${flight_track.flightTracks[0].callsign}
                        *Departed at:* ${formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateLocal)} (Local), ${formatter.data.formatDateTime(flight_track.flightTracks[0].departureDate.dateUtc)} (UTC)
                        *Postion at:* ${formatter.data.formatDateTime(flight_track.flightTracks[0].positions[0].date)} (UTC)
                        *Traveling* from ${flight_track.flightTracks[0].departureAirportFsCode} to ${flight_track.flightTracks[0].arrivalAirportFsCode}`
                    }
                },
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        "text": `${flight_track.flightTracks[0].callsign} map preview`,
                        "emoji": true
                    },
                    "image_url": `https://open.mapquestapi.com/staticmap/v5/map?locations=${flight_track.flightTracks[0].positions[0].lat},${flight_track.flightTracks[0].positions[0].lon}&size=@2x&zoom=8&key=${config.mapquest.maps_key}`,
                    "alt_text": "map of aircraft"
                }
            ],
            "attachments": [
                {
                    "fallback": `View your flights at https://www.openstreetmap.org/?mlat=${flight_track.flightTracks[0].positions[0].lat}&mlon=${flight_track.flightTracks[0].positions[0].lon}&zoom=9#map=9/${flight_track.flightTracks[0].positions[0].lat}/${flight_track.flightTracks[0].positions[0].lon}`,
                    "actions": [
                        {
                            "type": "button",
                            "text": "View full map",
                            "url": `https://www.openstreetmap.org/?mlat=${flight_track.flightTracks[0].positions[0].lat}&mlon=${flight_track.flightTracks[0].positions[0].lon}&zoom=9#map=9/${flight_track.flightTracks[0].positions[0].lat}/${flight_track.flightTracks[0].positions[0].lon}`
                        }
                    ]
                }
            ]
        }
        return JSON.stringify(message)
    } else {
        return `Cannot find a position for ${flight_track.request.airline.requestedCode}${flight_track.request.flight.requested}. It may not be airborne`
    }

}

methods.setStatusMessage = (flight_status) => {
    var flt_status = flight_status.flightStatuses[0]
    var airports = flight_status.appendix.airports;
    var message = {
        "response_type": "in_channel",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
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
                    "text": `*Flight Time:* ${formatter.data.formatFlightTime(flt_status.flightDurations.scheduledBlockMinutes)}\n*Gate Departure:*\nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateDeparture.dateUtc)}_ (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateDeparture.dateUtc)}_ (UTC)\nTerminal _${flt_status.airportResources.departureTerminal}_, Gate _${flt_status.airportResources.departureGate}_\n*Gate Arrival*\nScheduled _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateLocal)}_ (local) _${formatter.data.formatDateTime(flt_status.operationalTimes.scheduledGateArrival.dateUtc)}_ (UTC)\nEstimated _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateLocal)}_ (Local) _${formatter.data.formatDateTime(flt_status.operationalTimes.estimatedGateArrival.dateUtc)}_ (UTC)\nTerminal _${flt_status.airportResources.arrivalTerminal}_`
                }
            }
        ]
    }
    return JSON.stringify(message);
}

methods.setDelayMessage = (delayed_airport) => {
    var message = {
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
    return JSON.stringify(message)
}

// TODO: format using Slock Block builder
methods.setHelpMessage = (message) => {
    return `${message}
    these commands are available:
    status [aircraft callsign] ex) [/flightcheck status aa100], to find out whether your aircraft is delayed
    status [airport identifier] ex) [/flightcheck status ksfo], for any delays at the airport
    position [aircraft call sign] ex) [/flightcheck position aa100], to see a map of the aircraft
    help, to see this menu
    `
}

exports.data = methods;
