"use strict";

const request = require('request');
const Q = require('q');
const log = require('../utils/logger');

var weatherInfo = () => {
  const deferred = Q.defer();
  
  // Toronto ID from openweather
  let regionID = '6167865';
  let url = 'http://api.openweathermap.org/data/2.5/weather?appid=' 
    + process.env.WEATHER_API_KEY 
    + '&id=' 
    + regionID
    + '&units=metric';

  request.get(url, (err, res, body) => {
    if (!err &&  res.statusCode == 200) {
      body = JSON.parse(body);

      deferred.resolve(body);
    } else {
      deferred.reject();
    }
  });
    
  return deferred.promise;
};

module.exports = {
  weatherInfo
};