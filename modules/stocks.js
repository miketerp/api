"use strict";

const request = require('request');
const Q = require('q');

const data = require('./data');
const log = require('../utils/logger');

let basicStocksInfo = () => {
  const deferred = Q.defer();

  let url = 'https://api.worldtradingdata.com/api/v1/stock?symbol=' 
    + process.env.POSITIONS_SYMBOLS 
    + '&api_token=' 
    + process.env.WTD_API_KEY;

  request.get(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      body = JSON.parse(body);

      let obj = {};
      obj.data = [];

      let resultList = body.data;
      for (let i = 0; i < resultList.length; i++) {
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
          day_change_percent: resultList[i].change_pct,
          market_cap: (parseFloat(resultList[i].market_cap) / 1000000000) + ' B',
          volume: (parseFloat(resultList[i].volume) / 1000000) + ' M',
          avg_volume: function() {
            let obj = resultList[i].volume_avg;

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

let getForexInfo = () => {
  const deferred = Q.defer();

  let url = 'https://api.worldtradingdata.com/api/v1/forex?base=CAD&api_token=' 
    + process.env.WTD_API_KEY;

  request.get(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      body = JSON.parse(body);
      
      let obj = {
        currency: {
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

let getDailyInfo = () => {
  const deferred = Q.defer();
  
  let obj = Q.all([
    data.getDataFromMongoDB(),
    getForexInfo(),
    basicStocksInfo()
  ]);

  obj.then((resultsFromDB) => {
    // let resultObj = { ...resultsFromDB[0], ...resultsFromDB[1], ...resultsFromDB[2] }

    let hashObj = {};
    resultsFromDB[0]["positions"].forEach((val) => {
      hashObj[val.name] = {
        qty: val.qty,
        currency: val.currency,
        price: val.price
      };
    });

    resultsFromDB[2]["data"].forEach((val) => {
      val.marketVal = val.price * hashObj[val.symbol].qty;
      val.position = hashObj[val.symbol].price * hashObj[val.symbol].qty;
      val.profits = function() {
        let tmp;
        
        if (val.currency == 'USD') {
          let curr = (1 / resultsFromDB[1]["currency"][val.currency]);
          tmp = curr * parseInt((val.marketVal - val.position));
        } else {
          tmp = val.marketVal - val.position;
        }
        return tmp;
      } ();
    });

    let tmp = {
      data: resultsFromDB[2]["data"]
    };

    deferred.resolve(tmp);
  })
  .catch((err) => {
    log.info(err);
    deferred.reject();
  });

  return deferred.promise;
};

module.exports = {
  basicStocksInfo,
  getForexInfo,
  getDailyInfo
};