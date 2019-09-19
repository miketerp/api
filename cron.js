"use strict";

const CronJob = require('cron').CronJob;

const finance = require('./modules/stocks');
const notify = require('./modules/twilio');
const log = require('./utils/logger');

const dailyCloseNotify = () => {
  // const job = new CronJob('*/15 * * * * *',
  const job = new CronJob('00 45 16 * * 1-5',
    (onComplete) => {
      log.info('Running smsStocksInfo()');

      let promise = finance.getDailyInfo();
      promise.then((obj) => {
        let todaysPosition = "";
        let totalPL = 0;

        obj.data.forEach((val) => {
          todaysPosition = todaysPosition
            + val.symbol + ": " + val.day_change_percent + "% (" + val.day_change + ")\n"
            + 'P&L: ' + (((val.marketVal - val.position)/val.position) * 100).toFixed(2) // THIS IS A STRING
            + '% (' + (val.marketVal - val.position).toFixed(2) + " " + val.currency + ')\n\n';
          
          totalPL += val.profits;
        });
        
        todaysPosition = todaysPosition + `Total P&L: $${totalPL.toFixed(2)} CAD`;
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