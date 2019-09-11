"use strict";

const Q = require('q');
const log = require('../utils/logger');
const MongoClient = require('mongodb').MongoClient;

let _db;
let _collection;

const url = 'mongodb://localhost:27017';
const dbName = 'mydb';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect((err, db) => {
  // Do database operations
  _db = client.db(dbName);
  _collection = _db.collection('assets');
});

const getDataFromMongoDB = () => {
  var deferred = Q.defer();
  
  // Find some documents
  _collection.find().toArray((err, docs) => {
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

module.exports = {
  getDataFromMongoDB
};