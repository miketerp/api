"use strict";

const request = require('request');
const Q = require('q');

const log = require('../utils/logger');

let queryElastic = (args) => {
  const deferred = Q.defer();
  // console.log(args);
  
  console.log(args);
  let [city, state] = args.location.split(", ");
  
  // Toronto ID from openweather
  // let regionID = '6167865';
  // let url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&appid=' 
  //   + process.env.WEATHER_API_KEY 
  //   + '&id=' 
  //   + regionID;

  request({
    uri: "http://localhost:9200/yelp-can/_search",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      "query": {
        "bool": {
          "must": {
            "multi_match": {
              "query": args.query, 
              "fields": [ 
                "categories", 
                "name"
              ]
            }
          },
          "filter": [{
            "match": {
              "state": state
            }
          }, {
            "match": {
              "city": city
            }
          }, {
            "range": {
              "stars": {
                "gte": args.stars
              }
            }
          }
          // , {
          //   "range": {
          //     "review_count": {
          //       "gte": 10
          //     }
          //   }
          // }
          ]
        }
      }
    })
  }, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      body = JSON.parse(body);
      // console.log(body.hits.hits);
      
      deferred.resolve(body.hits.hits);
    } else {
      deferred.reject();
    }
  });
    
  return deferred.promise;
};

module.exports = {
  queryElastic
};
