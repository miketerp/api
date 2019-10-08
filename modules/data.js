"use strict";

const Q = require('q');
const log = require('../utils/logger');
const MongoClient = require('mongodb').MongoClient;

let _db;

const url = process.env.MONGO;
const dbName = 'mydb';
const client = new MongoClient(url, { 
  useNewUrlParser: true 
});

client.connect((err, db) => {
  if (err) {
    log.error(err);
    throw err;
  }
  
  _db = client.db(dbName);
});

const getDataFromMongoDB = () => {
  var deferred = Q.defer();
  
  // Find some documents
  _db.collection('assets').find().toArray((err, docs) => {
    if (err) {
      log.error(err);
      deferred.reject();
    } else {
      var obj = {
        positions: docs
      };
      
      deferred.resolve(obj);
    }
  });

  return deferred.promise;
};

const insertDataToMongoDB = (queryParams) => {
  var deferred = Q.defer();
  
  // make sure to have front-end parsing and model structure to prevent garbage being added in db
  _db.collection('users').insertOne(queryParams, (err, records) => {
    if (err) {
      log.error(err);
      deferred.reject();
    } else {
      log.info(`Inserted Record: ${records}`);
      deferred.resolve(`Inserted Record :)`);
    }
  });

  return deferred.promise;
};

module.exports = {
  getDataFromMongoDB,
  insertDataToMongoDB
};