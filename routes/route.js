"use strict";

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Hello World!');
  // res.sendfile('public/index.html');
});

/*
router.get('/stocks', function(req, res) {
  var promise = finance.stocks();
  promise.then(function(obj) {
    console.log('Sending MarketView JSON back...');
    res.send(obj);
  });
});

router.get('/historical', function(req, res) {    
  var promise = finance.historical();
    promise.then(function(obj) {
    console.log('Sending Historical JSON back...');
    res.send(obj);
  });
});
*/
module.exports = router;
