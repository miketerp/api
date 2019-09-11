"use strict";

const pushSMS = (todaysPosition) => {
  const accountSid = process.env.TWLO_accountSid;
  const authToken = process.env.TWLO_authToken;

  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      from: process.env.TWLO_NUMBER,
      to: process.env.TWLO_TO,
      body: function() {
        var msg = 'Hello, Sangho.\nHere are todays\' changes: \n\n' + todaysPosition;
        return msg;
      } ()
    })
    .then((message) => {
      // console.log(message.sid);
      // if (!err) {
      //   console.log("Not errored! Sending!");
      //   //console.log(responseData.from); // outputs "+14506667788"
      //   //console.log(responseData.body); // outputs "word to your mother."
      // } else {
      //   //log.warn(message.sid);
      //   log.warn(err);
      // }
    });
    
  // switch to log.info
  console.log("Done sending message!");
};

module.exports = {
  pushSMS
};