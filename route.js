"use strict";

const express = require('express');
const router = express.Router();

const log = require('./utils/logger');
const weather = require('./modules/weather');

router.get('/', (req, res, next) => {
  res.send('Hello World!');
  // res.sendfile('public/index.html');
});

// router.get('/user/:id', (req, res, next) => {
//   res.send("Hello there!");
// });

router.get('/weather', (req, res, next) => {
  let promise = weather.currentWeatherInfo();
  promise.then((data) => {
    // log.info()
    res.send(data);
  });
});

/*
router.get('/stocks', (req, res) => {
  var promise = finance.stocks();
  promise.then(function(obj) {
    console.log('Sending MarketView JSON back...');
    res.send(obj);
  });
});

router.get('/historical', (req, res) => {
  var promise = finance.historical();
    promise.then(function(obj) {
    console.log('Sending Historical JSON back...');
    res.send(obj);
  });
});
*/

module.exports = router;
