const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var log = bunyan.createLogger({
  name: 'gcp-api',
  streams: [{
    level: 'debug',
    type: 'raw',
    stream: prettyStdOut
  }]
});

module.exports = log;
