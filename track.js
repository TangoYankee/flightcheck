var config = require('./config');

var no_position = {
    "request": {
     "airline": {
      "requestedCode": "AA",
      "fsCode": "AA"
     },
     "flight": {
      "requested": "100",
      "interpreted": "100"
     },
     "date": {
      "year": "2019",
      "month": "5",
      "day": "15",
      "interpreted": "2019-05-15"
     },
     "hourOfDay": {
      "interpreted": 0
     },
     "numHours": {
      "interpreted": 24
     },
     "utc": {
      "requested": "true",
      "interpreted": true
     },
     "airport": {},
     "includeFlightPlan": {
      "requested": "false",
      "interpreted": false
     },
     "maxPositions": {
      "requested": "2",
      "interpreted": 2
     },
     "maxPositionAgeMinutes": {},
     "codeType": {},
     "extendedOptions": {},
     "url": "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/AA/100/dep/2019/5/15"
    },
    "appendix": {
     "airlines": [
      {
       "fs": "AA",
       "iata": "AA",
       "icao": "AAL",
       "name": "American Airlines",
       "phoneNumber": "08457-567-567",
       "active": true
      }
     ]
    },
    "flightTracks": []
   }

var position = {
    "request": {
     "airline": {
      "requestedCode": "ANA",
      "fsCode": "NH"
     },
     "flight": {
      "requested": "8",
      "interpreted": "8"
     },
     "date": {
      "year": "2019",
      "month": "5",
      "day": "15",
      "interpreted": "2019-05-15"
     },
     "hourOfDay": {
      "interpreted": 0
     },
     "numHours": {
      "interpreted": 24
     },
     "utc": {
      "requested": "false",
      "interpreted": false
     },
     "airport": {},
     "includeFlightPlan": {
      "requested": "false",
      "interpreted": false
     },
     "maxPositions": {
      "requested": "2",
      "interpreted": 2
     },
     "maxPositionAgeMinutes": {},
     "codeType": {},
     "extendedOptions": {},
     "url": "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/ANA/8/dep/2019/5/15"
    },
    "appendix": {
     "airlines": [
      {
       "fs": "NH",
       "iata": "NH",
       "icao": "ANA",
       "name": "ANA",
       "phoneNumber": "1-800-235-9262",
       "active": true
      }
     ],
     "airports": [
      {
       "fs": "NRT",
       "iata": "NRT",
       "icao": "RJAA",
       "faa": "",
       "name": "Narita International Airport",
       "street1": "成田空港第2PTB(バス), Narita",
       "street2": "Chiba Prefecture",
       "city": "Tokyo",
       "cityCode": "TYO",
       "countryCode": "JP",
       "countryName": "Japan",
       "regionName": "Asia",
       "timeZoneRegionName": "Asia/Tokyo",
       "weatherZone": "",
       "localTime": "2019-05-16T01:59:15.674",
       "utcOffsetHours": 9,
       "latitude": 35.773213,
       "longitude": 140.387443,
       "elevationFeet": 135,
       "classification": 1,
       "active": true,
       "delayIndexUrl": "https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/NRT?codeType=fs",
       "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/NRT?codeType=fs"
      },
      {
       "fs": "SFO",
       "iata": "SFO",
       "icao": "KSFO",
       "faa": "SFO",
       "name": "San Francisco International Airport",
       "city": "San Francisco",
       "cityCode": "SFO",
       "stateCode": "CA",
       "postalCode": "94128",
       "countryCode": "US",
       "countryName": "United States",
       "regionName": "North America",
       "timeZoneRegionName": "America/Los_Angeles",
       "weatherZone": "CAZ508",
       "localTime": "2019-05-15T09:59:15.674",
       "utcOffsetHours": -7,
       "latitude": 37.615215,
       "longitude": -122.389881,
       "elevationFeet": 11,
       "classification": 1,
       "active": true,
       "delayIndexUrl": "https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/SFO?codeType=fs",
       "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/SFO?codeType=fs"
      }
     ]
    },
    "flightTracks": [
     {
      "flightId": 999897165,
      "carrierFsCode": "NH",
      "flightNumber": "8",
      "tailNumber": "JA780A",
      "callsign": "ANA8",
      "departureAirportFsCode": "NRT",
      "arrivalAirportFsCode": "SFO",
      "departureDate": {
       "dateLocal": "2019-05-15T17:05:00.000",
       "dateUtc": "2019-05-15T08:05:00.000Z"
      },
      "equipment": "77W",
      "delayMinutes": 18,
      "bearing": 141.4032077163452,
      "heading": 140.31431438063944,
      "positions": [
       {
        "lon": -122.6771,
        "lat": 37.9006,
        "speedMph": 198,
        "altitudeFt": 8961,
        "source": "derived",
        "date": "2019-05-15T16:53:50.000Z"
       },
       {
        "lon": -122.7098,
        "lat": 37.9317,
        "speedMph": 428,
        "altitudeFt": 10410,
        "source": "derived",
        "date": "2019-05-15T16:52:50.000Z"
       }
      ]
     }
    ]
   }

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

var data = position;
if (data.flightTracks.length != 0){
    console.log(`${data.flightTracks[0].callsign}`)
    console.log(`Traveling from ${data.flightTracks[0].departureAirportFsCode} to ${data.flightTracks[0].arrivalAirportFsCode}`)
    console.log(`Departed at ${formatDateTime(data.flightTracks[0].departureDate.dateLocal)} (Local), ${formatDateTime(data.flightTracks[0].departureDate.dateUtc)} (UTC)`)
    console.log(`Position at ${formatDateTime(data.flightTracks[0].positions[0].date)} (UTC)`)
    console.log(`Position Latitude ${data.flightTracks[0].positions[0].lat}, Longitude ${data.flightTracks[0].positions[0].lon}`)
    console.log(`https://www.openstreetmap.org/?mlat=${data.flightTracks[0].positions[0].lat}&mlon=${data.flightTracks[0].positions[0].lon}&zoom=9#map=9/${data.flightTracks[0].positions[0].lat}/${data.flightTracks[0].positions[0].lon}`)
    console.log(`https://open.mapquestapi.com/staticmap/v5/map?locations=${data.flightTracks[0].positions[0].lat},${data.flightTracks[0].positions[0].lon}&size=@2x&zoom=8&key=${config.mapquest.maps_key}`)
} else {
    console.log(`Cannot find a position for ${data.request.airline.requestedCode}${data.request.flight.requested}. It may not be airborne`)
}
