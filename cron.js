"use strict";

const CronJob = require('cron').CronJob;

const finance = require('./modules/stocks');
var notify = require('./modules/twilio');
const log = require('./utils/logger');

const dailyCloseNotify = () => {
  const job = new CronJob('00 45 16 * * 1-5',
    (onComplete) => {
      log.info('Running smsStocksInfo()');

      var promise = finance.getDailyInfo();
      promise.then((obj) => {
        var hashObj = {};
        var todaysPosition = "";
        
        obj.positions.forEach((val, key) => {
          hashObj[val.name] = {
            qty: val.qty,
            currency: val.currency,
            price: val.price
          };
        });

        obj.data.forEach(function(val, key) {
          var marketVal = val.price * hashObj[val.symbol].qty;
          var position = hashObj[val.symbol].price * hashObj[val.symbol].qty;
        
          todaysPosition = todaysPosition
            + val.symbol + ": " + val.day_change_percent + "% (" + val.day_change + ")\n"
            + 'P&L: ' + (((marketVal - position)/position) * 100).toFixed(2) // THIS IS A STRING
            + '% (' + ((marketVal) - (position)).toFixed(2) + " " + hashObj[val.symbol].currency + ')\n\n';
        });
        
        // todaysPosition = todaysPosition + "Total P&L: " + obj.totalPL;
        notify.pushSMS(todaysPosition);

        onComplete();
      });
    },
    () => {
      // fires when job is complete
      log.info('Finished pushing SMS');
    },
    true,
    'America/Toronto'
  );
};

module.exports = {
  dailyCloseNotify
};