// Delay index of Airport

var methods = {}

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

console.log(`${delayed_airport.delayIndexes[0].airport.name} (${delayed_airport.delayIndexes[0].airport.icao})`)
console.log(`Delay Index ${delayed_airport.delayIndexes[0].normalizedScore}/5`)
console.log(`From ${formatDateTime(delayed_airport.delayIndexes[0].dateStart)} to ${formatDateTime(delayed_airport.delayIndexes[0].dateEnd)} (UTC)`)


var sample_delay = {
     "request": {
         "airportCodes": [
             {
                 "requestedCode": "PDX",
                 "fsCode": "PDX"
             },
             {
                 "requestedCode": "LAX",
                 "fsCode": "LAX"
             },
             {
                 "requestedCode": "LGA",
                 "fsCode": "LGA"
             },
             {
                 "requestedCode": "JFK",
                 "fsCode": "JFK"
             }
         ],
         "codeType": {},
         "url": "https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/PDX,LAX,LGA,JFK",
         "classification": {},
         "score": {}
     },
     "delayIndexes": [
         {
             "airport": {
                 "fs": "PDX",
                 "iata": "PDX",
                 "icao": "KPDX",
                 "faa": "PDX",
                 "name": "Portland International Airport",
                 "street1": "7000 NE Airport Way",
                 "city": "Portland",
                 "cityCode": "PDX",
                 "stateCode": "OR",
                 "postalCode": "97218",
                 "countryCode": "US",
                 "countryName": "United States",
                 "regionName": "North America",
                 "timeZoneRegionName": "America/Los_Angeles",
                 "weatherZone": "ORZ006",
                 "localTime": "2013-02-26T16:37:45.427",
                 "utcOffsetHours": -8.0,
                 "latitude": 45.588995,
                 "longitude": -122.592901,
                 "elevationFeet": 30,
                 "classification": 1,
                 "active": true,
                 "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/PDX?codeType=fs"
             },
             "rawScore": 3.7800000000000002,
             "normalizedScore": 0.5,
             "dateStart": "2013-02-26T23:30:00.000Z",
             "dateEnd": "2013-02-27T02:30:00.000Z",
             "flights": 42,
             "observations": 39,
             "canceled": 0,
             "onTime": 36,
             "delayed15": 1,
             "delayed30": 2,
             "delayed45": 0,
             "delta": 0.0
         },
         {
             "airport": {
                 "fs": "LAX",
                 "iata": "LAX",
                 "icao": "KLAX",
                 "faa": "LAX",
                 "name": "Los Angeles International Airport",
                 "street1": "One World Way",
                 "street2": "",
                 "city": "Los Angeles",
                 "cityCode": "LAX",
                 "stateCode": "CA",
                 "postalCode": "90045-5803",
                 "countryCode": "US",
                 "countryName": "United States",
                 "regionName": "North America",
                 "timeZoneRegionName": "America/Los_Angeles",
                 "weatherZone": "CAZ041",
                 "localTime": "2013-02-26T16:37:45.427",
                 "utcOffsetHours": -8.0,
                 "latitude": 33.943399,
                 "longitude": -118.408279,
                 "elevationFeet": 126,
                 "classification": 1,
                 "active": true,
                 "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/LAX?codeType=fs"
             },
             "rawScore": 44.86,
             "normalizedScore": 2.0,
             "dateStart": "2013-02-26T23:30:00.000Z",
             "dateEnd": "2013-02-27T02:30:00.000Z",
             "flights": 112,
             "observations": 111,
             "canceled": 0,
             "onTime": 95,
             "delayed15": 3,
             "delayed30": 0,
             "delayed45": 13,
             "delta": 0.0
         },
         {
             "airport": {
                 "fs": "LGA",
                 "iata": "LGA",
                 "icao": "KLGA",
                 "faa": "LGA",
                 "name": "LaGuardia Airport",
                 "street1": "Hangar 7 Center",
                 "city": "New York",
                 "cityCode": "NYC",
                 "stateCode": "NY",
                 "postalCode": "11371",
                 "countryCode": "US",
                 "countryName": "United States",
                 "regionName": "North America",
                 "timeZoneRegionName": "America/New_York",
                 "weatherZone": "NYZ176",
                 "localTime": "2013-02-26T19:37:45.427",
                 "utcOffsetHours": -5.0,
                 "latitude": 40.774252,
                 "longitude": -73.871617,
                 "elevationFeet": 22,
                 "classification": 1,
                 "active": true,
                 "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/LGA?codeType=fs"
             },
             "rawScore": 53.199999999999996,
             "normalizedScore": 2.75,
             "dateStart": "2013-02-26T23:30:00.000Z",
             "dateEnd": "2013-02-27T02:30:00.000Z",
             "flights": 92,
             "observations": 92,
             "canceled": 5,
             "onTime": 71,
             "delayed15": 7,
             "delayed30": 3,
             "delayed45": 6,
             "delta": -10.0
         },
         {
             "airport": {
                 "fs": "JFK",
                 "iata": "JFK",
                 "icao": "KJFK",
                 "faa": "JFK",
                 "name": "John F. Kennedy International Airport",
                 "street1": "JFK Airport",
                 "city": "New York",
                 "cityCode": "NYC",
                 "stateCode": "NY",
                 "postalCode": "11430",
                 "countryCode": "US",
                 "countryName": "United States",
                 "regionName": "North America",
                 "timeZoneRegionName": "America/New_York",
                 "weatherZone": "NYZ178",
                 "localTime": "2013-02-26T19:37:45.427",
                 "utcOffsetHours": -5.0,
                 "latitude": 40.642335,
                 "longitude": -73.78817,
                 "elevationFeet": 13,
                 "classification": 1,
                 "active": true,
                 "weatherUrl": "https://api.flightstats.com/flex/weather/rest/v1/json/all/JFK?codeType=fs"
             },
             "rawScore": 31.080000000000002,
             "normalizedScore": 1.25,
             "dateStart": "2013-02-26T23:30:00.000Z",
             "dateEnd": "2013-02-27T02:30:00.000Z",
             "flights": 108,
             "observations": 106,
             "canceled": 2,
             "onTime": 94,
             "delayed15": 4,
             "delayed30": 2,
             "delayed45": 4,
             "delta": -5.0
         }
     ]
 }

exports.data = methods;
