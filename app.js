"use strict";

const express = require('express');
const app = express();

const log = require('./utils/logger');
const routes = require('./route');
const cron = require('./cron');

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] 
    || req.connection.remoteAddress 
    || req.socket.remoteAddress 
    || req.connection.socket.remoteAddress;

  let logStream = `\n ${new Date()} | /${req.method.toString()} | ${ip} | ${req.path} | ${JSON.stringify(req.query)} | ${req.headers['user-agent']}`;
  log.info(logStream);

  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  //res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //res.setHeader('Access-Control-Allow-Methods', 'POST');
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const port = process.env.DEV_PORT || 80;

let server = app.listen(port, () => {
  let host = server.address().address;
  let port = server.address().port;
  
  log.info(`App is listening at http://${host}:${port}`);
});

log.info("Starting CronJob");
// cron.dailyCloseNotify();

app.use('/', routes);

app.use((err, req, res) => {
  log.warn(`Printing error stack: ${err.stack}`); 
  res.status(500).send('5xx');
});

app.use((err, req, res) => {
  log.warn(`Printing error stack: ${err.stack}`); 
  res.status(404).send('404');
});
