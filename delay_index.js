// Delay index of Airport

var delayed_airport = {
    "request": {
     "airportCodes": [
      {
       "requestedCode": "KSFO",
       "fsCode": "SFO"
      }
     ],
     "codeType": {},
     "url": "https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/KSFO",
     "classification": {
      "requested": "5",
      "interpreted": 5
     },
     "score": {
      "requested": "3",
      "interpreted": 3
     }
    },
    "delayIndexes": [
     {
      "airport": {
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
       "localTime": "2019-05-15T10:59:01.689",
       "utcOffsetHours": -7,
       "latitude": 37.615215,
       "longitude": -122.389881,
       "elevationFeet": 11,
       "classification": 1,
       "active": true,
       "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/SFO?codeType=fs"
      },
      "rawScore": 248.12,
      "normalizedScore": 5,
      "dateStart": "2019-05-15T17:00:00.000Z",
      "dateEnd": "2019-05-15T20:00:00.000Z",
      "flights": 139,
      "observations": 136,
      "canceled": 23,
      "onTime": 81,
      "delayed15": 5,
      "delayed30": 4,
      "delayed45": 23,
      "delta": 0
     }
    ]
   }
