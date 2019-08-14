"use strict";

const CronJob = require('cron').CronJob;

const finance = require('./modules/stocks');
//var notify = require('./notifications');
const log = require('./utils/logger');

const dailyCloseNotify = () => {
  //cronTime: '00 45 16 * * 1-5',
  const job = new CronJob('*/15 * * * * *',
    (onComplete) => {
      log.info('Running smsStocksInfo()');

      var promise = finance.getDailyInfo();
      promise.then((obj) => {
        log.info(obj);
        // var todaysPosition = "";
        // obj.data.forEach(function(val, key) {
        //   todaysPosition = todaysPosition
        //     + val.symbol + ": " + val.changeInPercent + " (" + val.changeInValue + ")\n"
        //     + 'P&L: ' + ((val.position/val.amountInvested) * 100).toFixed(2) // THIS IS A STRING
        //     + '% (' + val.position + " " + val.currency + ')\n\n';
        // });

        // todaysPosition = todaysPosition + "Total P&L: " + obj.totalPL;
        // notify.pushSMS(todaysPosition);

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