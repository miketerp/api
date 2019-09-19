"use strict";

const request = require('request');
const Q = require('q');
const nodemailer = require('nodemailer');

const log = require('../utils/logger');

let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.HOTMAIL,
    pass: process.env.HOTMAIL_PASS
  }
});

let currentWeatherInfo = () => {
  const deferred = Q.defer();
  
  // Toronto ID from openweather
  let regionID = '6167865';
  let url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&appid=' 
    + process.env.WEATHER_API_KEY 
    + '&id=' 
    + regionID;

  request.get(url, (err, res, body) => {
    if (!err &&  res.statusCode == 200) {
      body = JSON.parse(body);
      
      transporter.sendMail({
        from: process.env.HOTMAIL,
        to: process.env.GMAIL,
        // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
        subject: 'Can I wear shorts today?',
        html: function () {
          var res = (body.main.temp > 22) ? "Yes, you can wear shorts :)" : "No, you can't wear shorts :(";

          return `<h2>Current weather in ${body.name}, ${body.sys.country}</h2>
          <img src="http://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png" alt="${body.weather[0].main}">
          <h3>${body.main.temp.toFixed(0)}<span>&#176;</span>C | Humidity ${body.main.humidity}%</h3>
          <h3>${body.weather[0].description}</h3>
          <h1>${res}</h1>`
        } ()
      }, (error, info) => {
        if (error) {
          log.warn(error);
        } else {
          log.info(`Email sent: ${info.response}`);
        }
      }); 

      deferred.resolve(body);
    } else {
      deferred.reject();
    }
  });
    
  return deferred.promise;
};

let threeHourForecasts = () => {
  const deferred = Q.defer();

  // Toronto ID from openweather
  let regionID = '6167865';
  let url = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' 
    + process.env.WEATHER_API_KEY 
    + '&id=' 
    + regionID;

  request.get(url, (err, res, body) => {
    if (!err &&  res.statusCode == 200) {
      body = JSON.parse(body);
      
      // do stuff here
      deferred.resolve(body);
    } else {
      deferred.reject();
    }
  });
  
  return deferred.promise;
}

module.exports = {
  currentWeatherInfo,
  threeHourForecasts
};