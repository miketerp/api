"use strict";

const request = require('request');
const Q = require('q');

const data = require('./data');
const log = require('../utils/logger');

var basicStocksInfo = () => {
  const deferred = Q.defer();
  
  let url = 'https://api.worldtradingdata.com/api/v1/stock?symbol=' 
    + process.env.POSITIONS_SYMBOLS 
    + '&api_token=' 
    + process.env.WTD_API_KEY;

  request.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      
      var obj = {};
      obj.data = [];

      var resultList = body.data;
      for (var i = 0; i < resultList.length - 1; i++) {
        obj.data.push({
          symbol: resultList[i].symbol,
          name: resultList[i].name,
          currency: resultList[i].currency,
          price: resultList[i].price,
          previousClose: resultList[i].close_yesterday,
          price_open: resultList[i].price_open,
          day_high: resultList[i].day_high,
          day_low: resultList[i].day_low,
          year_high: resultList[i]["52_week_high"],
          year_low: resultList[i]["52_week_low"],
          day_change: resultList[i].day_change,
          day_change_percent: resultList[i].day_change_percent,
          market_cap: (parseFloat(resultList[i].market_cap) / 1000000000) + ' B',
          volume: (parseFloat(resultList[i].volume) / 1000000) + ' M',
          avg_volume: function() {
            var obj = resultList[i].volume_avg;

            if (obj) {
              obj = (parseFloat(obj) / 1000000) + ' M'
            }

            return obj;
          } (),
          shares: (parseFloat(resultList[i].shares) / 1000000) + ' M',
          exchange: resultList[i].stock_exchange_short
        });
      }

      deferred.resolve(obj);
    } else {
      deferred.reject();
    }
  });

  return deferred.promise;
};

var getForexInfo = () => {
  const deferred = Q.defer();

  let url = 'https://api.worldtradingdata.com/api/v1/forex?base=CAD&api_token=' 
    + process.env.WTD_API_KEY;

  request.get(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      
      let obj = {
        currency: {
          KOR: body["data"]["KRW"],
          JAP: body["data"]["JPY"],
          USD: body["data"]["USD"]
        }
      };

      deferred.resolve(obj);
    } else {
      deferred.reject();
    }
  });

  return deferred.promise;
};

var getDailyInfo = () => {
  const deferred = Q.defer();
  
  let obj = Q.all([
    data.getDataFromMongoDB()
    // basicStocksInfo()
  ]);

  obj.then((resultsFromDB) => {
    deferred.resolve(resultsFromDB);
  });

  return deferred.promise;
};

module.exports = {
  basicStocksInfo,
  getForexInfo,
  getDailyInfo
};