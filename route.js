"use strict";

const express = require('express');
const router = express.Router();

const log = require('./utils/logger');
const weather = require('./modules/weather');
const data = require('./modules/data');
const elastic = require('./modules/elastic');

router.get('/', (req, res, next) => {
  res.send('Hello World!');
  // res.sendfile('public/index.html');
});

// router.get('/user/:id', (req, res, next) => {
//   res.send("Hello there!");
// });

router.get('/elastic', (req, res) => {
  let promise = elastic.queryElastic(req.query);
  promise.then((data) => {
    // log.info(data);
    res.send(data);
  });
});

router.post('/insert', (req, res) => {
  let promise = data.insertDataToMongoDB(req.query);
  promise.then((data) => {
    // log.info(data);
    res.send(data);
  });
});

router.get('/shorts', (req, res, next) => {
  let promise = weather.currentWeatherInfo();
  promise.then((data) => {
    // log.info(data);
    res.send(data);
  });
});

router.get('/forecasts', (req, res, next) => {
  let promise = weather.threeHourForecasts();
  promise.then((data) => {
    // log.info(data);
    res.send(data);
  });
});

module.exports = router;
