const express = require('express');
const app = express();

const log = require('./logger');
const routes = require('./route');
const cron = require('./cron');

const port = process.env.DEV_PORT || 80;

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var ip = req.headers['x-forwarded-for'] 
    || req.connection.remoteAddress 
    || req.socket.remoteAddress 
    || req.connection.socket.remoteAddress;
  var queryParams = req.query;

  var logStream = '\n' + new Date() + ' | '  + ip + ' | /' + req.method.toString() + ' | ' + req.path;
  log.info(logStream);

  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  //res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //res.setHeader('Access-Control-Allow-Methods', 'POST');
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var server = app.listen(port, () => {
  var host = server.address().address;
  var port = server.address().port;
  log.info('App is listening at http://%s:%s', host, port);
});

log.info("Starting CronJob");

cron.dailyCloseNotify();

app.use('/', routes);

app.use((err, req, res) => {
  log.warn(`Printing error stack: ${err.stack}`);
  res.status(500).send('5xx');
});

app.use((req, res) => {
  res.status(404).send('404');
});
