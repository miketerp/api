"use strict";

const CronJob = require('cron').CronJob;

var finance = require('./modules/stocks');
const log = require('./logger');

module.exports.dailyCloseNotify = function() {
  //cronTime: '00 45 16 * * 1-5',
  const job = new CronJob('*/15 * * * * *',
    (onComplete) => {
      log.info('Running smsStocksInfo()');

      var promise = finance.basicStocksInfo();
      promise.then(function(obj) {
        var todaysPosition = "";

        obj.data.forEach(function(val, key) {
          console.log("iterate and make use of it here")
        });

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
